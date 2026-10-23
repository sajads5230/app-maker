import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import { SupportService } from './support.service.js';

export const supportRoutes: FastifyPluginAsync = async (server: FastifyInstance) => {
  // ==========================================
  // 1. USER SIDE ENDPOINTS
  // ==========================================

  // 1.1 Get Support Tickets List for Current User
  server.get('/api/support/tickets', async (request, reply) => {
    const { userId } = request.query as { userId?: string };
    const tickets = SupportService.getTickets(userId || 'default-user');
    return reply.send({ success: true, tickets });
  });

  // 1.2 Get Ticket Detail with Messages
  server.get('/api/support/tickets/:id', async (request, reply) => {
    const { id } = request.params as { id: string };
    const ticket = SupportService.getTicketById(id);
    if (!ticket) {
      return reply.status(404).send({ success: false, error: 'تیکت مورد نظر یافت نشد.' });
    }
    return reply.send({ success: true, ticket });
  });

  // 1.3 Create New Ticket
  server.post('/api/support/tickets', async (request, reply) => {
    const body = request.body as any;
    if (!body.subject || !body.content) {
      return reply.status(400).send({ success: false, error: 'موضوع و متن پیام تیکت الزامی است.' });
    }

    const ticket = SupportService.createTicket({
      userId: body.userId || 'default-user',
      userName: body.userName || 'مدیر فروشگاه هوشمند',
      userPhone: body.userPhone || '09121234567',
      userPlan: body.userPlan || 'PRO',
      appPackageName: body.appPackageName || 'ir.xiaomismart.store',
      subject: body.subject,
      department: body.department || 'TECHNICAL',
      priority: body.priority || 'MEDIUM',
      content: body.content,
      attachmentUrl: body.attachmentUrl,
    });

    return reply.send({
      success: true,
      message: 'تیکت شما با موفقیت ثبت شد و پاسخ اولیه صادر گردید.',
      ticket,
    });
  });

  // 1.4 Send Message / Reply to Ticket from User
  server.post('/api/support/tickets/:id/messages', async (request, reply) => {
    const { id } = request.params as { id: string };
    const body = request.body as any;

    if (!body.content) {
      return reply.status(400).send({ success: false, error: 'متن پاسخ نمی‌تواند خالی باشد.' });
    }

    const ticket = SupportService.addMessage(id, {
      sender: 'USER',
      senderName: body.senderName || 'مدیر فروشگاه هوشمند',
      content: body.content,
      attachmentUrl: body.attachmentUrl,
    });

    if (!ticket) {
      return reply.status(404).send({ success: false, error: 'تیکت مورد نظر یافت نشد.' });
    }

    return reply.send({ success: true, ticket });
  });

  // 1.5 Rate Ticket Satisfaction
  server.post('/api/support/tickets/:id/rate', async (request, reply) => {
    const { id } = request.params as { id: string };
    const { rating, feedback } = request.body as { rating: number; feedback?: string };

    if (!rating || rating < 1 || rating > 5) {
      return reply.status(400).send({ success: false, error: 'امتیاز باید عددی بین ۱ تا ۵ باشد.' });
    }

    const success = SupportService.rateTicket(id, rating, feedback);
    if (!success) {
      return reply.status(404).send({ success: false, error: 'تیکت یافت نشد.' });
    }

    return reply.send({ success: true, message: 'امتیاز شما با موفقیت ثبت شد. از بازخورد شما سپاسگزاریم!' });
  });

  // 1.6 Close Ticket by User
  server.post('/api/support/tickets/:id/close', async (request, reply) => {
    const { id } = request.params as { id: string };
    const success = SupportService.closeTicket(id);
    if (!success) {
      return reply.status(404).send({ success: false, error: 'تیکت یافت نشد.' });
    }

    return reply.send({ success: true, message: 'تیکت با موفقیت بسته شد.' });
  });

  // 1.7 FAQ & AI Assistant
  server.get('/api/support/faq', async (_, reply) => {
    return reply.send({ success: true, faqs: SupportService.FAQS });
  });

  server.post('/api/support/ai-chat', async (request, reply) => {
    const { message } = request.body as { message?: string };
    if (!message) {
      return reply.status(400).send({ success: false, error: 'متن پیام ارسال نشده است.' });
    }

    const aiAnswer = SupportService.generateAiResponse(message);
    return reply.send({
      success: true,
      answer: aiAnswer,
      timestamp: new Date().toISOString(),
      botName: 'پشتیبان هوشمند ۲۴ ساعته اپ‌ساز',
    });
  });

  // ==========================================
  // 2. SUPERADMIN SIDE ENDPOINTS
  // ==========================================

  // 2.1 Get All Tickets across All Users (with search & filters)
  server.get('/api/support/admin/tickets', async (request, reply) => {
    const query = request.query as {
      status?: string;
      department?: string;
      priority?: string;
      search?: string;
    };

    const tickets = SupportService.getAllTicketsAdmin(query);
    return reply.send({ success: true, count: tickets.length, tickets });
  });

  // 2.2 Get SuperAdmin KPI Stats & Overview
  server.get('/api/support/admin/stats', async (_, reply) => {
    const stats = SupportService.getAdminStats();
    return reply.send({ success: true, stats });
  });

  // 2.3 Send Official Agent Reply from SuperAdmin
  server.post('/api/support/admin/tickets/:id/reply', async (request, reply) => {
    const { id } = request.params as { id: string };
    const body = request.body as {
      agentName: string;
      content: string;
      newStatus?: 'ANSWERED' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
      attachmentUrl?: string;
    };

    if (!body.content) {
      return reply.status(400).send({ success: false, error: 'متن پاسخ کارشناس الزامی است.' });
    }

    const ticket = SupportService.replyAsAdmin(id, body);
    if (!ticket) {
      return reply.status(404).send({ success: false, error: 'تیکت مورد نظر یافت نشد.' });
    }

    return reply.send({
      success: true,
      message: 'پاسخ کارشناس با موفقیت برای مشتری ارسال شد.',
      ticket,
    });
  });

  // 2.4 Update Ticket Metadata (Status, Priority, Assigned Agent)
  server.patch('/api/support/admin/tickets/:id/meta', async (request, reply) => {
    const { id } = request.params as { id: string };
    const body = request.body as {
      status?: 'OPEN' | 'IN_PROGRESS' | 'ANSWERED' | 'RESOLVED' | 'CLOSED';
      priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
      assignedAgent?: string;
    };

    const ticket = SupportService.updateTicketMeta(id, body);
    if (!ticket) {
      return reply.status(404).send({ success: false, error: 'تیکت یافت نشد.' });
    }

    return reply.send({ success: true, message: 'اطلاعات تیکت به‌روزرسانی شد.', ticket });
  });

  // 2.5 Add Private Internal Note (Visible only to Support Team)
  server.post('/api/support/admin/tickets/:id/notes', async (request, reply) => {
    const { id } = request.params as { id: string };
    const { author, content } = request.body as { author: string; content: string };

    if (!content) {
      return reply.status(400).send({ success: false, error: 'متن یادداشت نمی‌تواند خالی باشد.' });
    }

    const ticket = SupportService.addInternalNote(id, {
      author: author || 'سوپرادمین سیستم',
      content,
    });

    if (!ticket) {
      return reply.status(404).send({ success: false, error: 'تیکت یافت نشد.' });
    }

    return reply.send({
      success: true,
      message: 'یادداشت داخلی با موفقیت ثبت شد.',
      internalNotes: ticket.internalNotes,
    });
  });

  // 2.6 Get Quick Canned Responses
  server.get('/api/support/admin/canned-responses', async (_, reply) => {
    const canned = SupportService.getCannedResponses();
    return reply.send({ success: true, cannedResponses: canned });
  });
};
