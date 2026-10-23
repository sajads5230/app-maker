import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import { prisma } from '../../prisma.js';

export const formsRoutes: FastifyPluginAsync = async (server: FastifyInstance) => {
  // Ensure default showcase forms exist for demo projects
  const ensureSeedDemoForms = async (projectId: string) => {
    const count = await prisma.customForm.count({ where: { projectId } });
    if (count === 0) {
      const warrantyForm = await prisma.customForm.create({
        data: {
          projectId,
          title: 'فرم ثبت گارانتی و خدمات پس از فروش',
          description: 'جهت فعال‌سازی گارانتی ۱۸ ماهه یا درخواست سرویس تعمیرات، اطلاعات زیر را ثبت فرمایید.',
          submitButtonText: 'ثبت اطلاعات گارانتی',
          successMessage: 'درخواست خدمات و فعال‌سازی گارانتی با موفقیت ثبت شد. کد پیگیری شما صادر گردید.',
          notifyPhone: '09121234567',
          fieldsJson: JSON.stringify([
            {
              id: 'f_name',
              label: 'نام و نام خانوادگی خریدار',
              type: 'text',
              placeholder: 'مثال: علیرضا محمدی',
              required: true,
            },
            {
              id: 'f_phone',
              label: 'شماره تلفن همراه',
              type: 'tel',
              placeholder: '09123456789',
              required: true,
            },
            {
              id: 'f_model',
              label: 'مدل دستگاه خریداری‌شده',
              type: 'select',
              required: true,
              options: [
                'گوشی موبایل شیائومی 14T Pro',
                'ساعت هوشمند Xiaomi Watch S3',
                'جاروبرقی رباتیک Mijia Omni',
                'هدفون Redmi Buds 5 Pro',
                'تلویزیون هوشمند شیائومی',
              ],
            },
            {
              id: 'f_serial',
              label: 'شماره سریال / کد IMEI دستگاه',
              type: 'text',
              placeholder: 'کد ۱۵ رقمی درج‌شده روی جعبه',
              required: true,
            },
            {
              id: 'f_issue',
              label: 'شرح مشکل یا درخواست',
              type: 'textarea',
              placeholder: 'در صورت نیاز به تعمیرات، توضیحات مشکل دستگاه را بنویسید...',
              required: false,
            },
          ]),
        },
      });

      // Add a demo submission
      await prisma.formSubmission.create({
        data: {
          formId: warrantyForm.id,
          projectId,
          userPhone: '09123232580',
          userName: 'رضا کمالی',
          dataJson: JSON.stringify({
            f_name: 'رضا کمالی',
            f_phone: '09123232580',
            f_model: 'ساعت هوشمند Xiaomi Watch S3',
            f_serial: '869402058493012',
            f_issue: 'درخواست فعال‌سازی گارانتی تعویض باتری و فریم',
          }),
          status: 'REVIEWED',
          adminNotes: 'استعلام سریال از سامانه جامع گارانتی تایید شد. برگه تاییدیه پیامک گردید.',
        },
      });
    }
  };

  // 1. List Forms for Project
  server.get('/api/projects/:projectId/forms', async (request, reply) => {
    const { projectId } = request.params as { projectId: string };
    await ensureSeedDemoForms(projectId);

    const forms = await prisma.customForm.findMany({
      where: { projectId },
      include: {
        _count: {
          select: { submissions: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const formatted = forms.map((f) => {
      let fields = [];
      try {
        fields = JSON.parse(f.fieldsJson);
      } catch (_) {}
      return {
        ...f,
        fields,
        submissionsCount: f._count.submissions,
      };
    });

    return reply.send({ success: true, forms: formatted });
  });

  // 2. Get Single Form
  server.get('/api/projects/:projectId/forms/:formId', async (request, reply) => {
    const { formId } = request.params as { formId: string };
    const form = await prisma.customForm.findUnique({
      where: { id: formId },
    });

    if (!form) {
      return reply.status(404).send({ success: false, error: 'فرم مورد نظر یافت نشد.' });
    }

    let fields = [];
    try {
      fields = JSON.parse(form.fieldsJson);
    } catch (_) {}

    return reply.send({ success: true, form: { ...form, fields } });
  });

  // 3. Create or Update Form
  server.post('/api/projects/:projectId/forms', async (request, reply) => {
    const { projectId } = request.params as { projectId: string };
    const { id, title, description, fields, submitButtonText, successMessage, notifyPhone } =
      request.body as {
        id?: string;
        title: string;
        description?: string;
        fields: any[];
        submitButtonText?: string;
        successMessage?: string;
        notifyPhone?: string;
      };

    if (!title || !fields || fields.length === 0) {
      return reply.status(400).send({
        success: false,
        error: 'عنوان فرم و حداقل یک فیلد ورودی الزامی است.',
      });
    }

    const fieldsJson = JSON.stringify(fields);

    let savedForm;
    if (id) {
      savedForm = await prisma.customForm.update({
        where: { id },
        data: {
          title,
          description: description || null,
          fieldsJson,
          submitButtonText: submitButtonText || 'ثبت و ارسال',
          successMessage: successMessage || 'اطلاعات شما با موفقیت ثبت شد.',
          notifyPhone: notifyPhone || null,
        },
      });
    } else {
      savedForm = await prisma.customForm.create({
        data: {
          projectId,
          title,
          description: description || null,
          fieldsJson,
          submitButtonText: submitButtonText || 'ثبت و ارسال',
          successMessage: successMessage || 'اطلاعات شما با موفقیت ثبت شد.',
          notifyPhone: notifyPhone || null,
        },
      });
    }

    return reply.send({
      success: true,
      message: 'فرم با موفقیت ذخیره گردید.',
      form: { ...savedForm, fields },
    });
  });

  // 4. Delete Form
  server.delete('/api/projects/:projectId/forms/:formId', async (request, reply) => {
    const { formId } = request.params as { formId: string };
    await prisma.customForm.delete({ where: { id: formId } });
    return reply.send({ success: true, message: 'فرم با موفقیت حذف شد.' });
  });

  // 5. Submit Form from Mobile App / Web Client
  server.post('/api/projects/:projectId/forms/:formId/submit', async (request, reply) => {
    const { projectId, formId } = request.params as { projectId: string; formId: string };
    const { data, userPhone, userName } = request.body as {
      data: Record<string, any>;
      userPhone?: string;
      userName?: string;
    };

    const form = await prisma.customForm.findUnique({
      where: { id: formId },
    });

    if (!form || !form.isActive) {
      return reply.status(404).send({ success: false, error: 'فرم معتبر نیست یا غیرفعال شده است.' });
    }

    const submission = await prisma.formSubmission.create({
      data: {
        formId,
        projectId,
        userPhone: userPhone || data?.f_phone || data?.phone || null,
        userName: userName || data?.f_name || data?.name || null,
        dataJson: JSON.stringify(data || {}),
        status: 'PENDING',
      },
    });

    return reply.send({
      success: true,
      message: form.successMessage || 'اطلاعات شما با موفقیت ارسال گردید.',
      submissionId: submission.id,
      trackingNumber: `FRM-${submission.id.substring(0, 8).toUpperCase()}`,
    });
  });

  // 6. List Submissions for Form
  server.get('/api/projects/:projectId/forms/:formId/submissions', async (request, reply) => {
    const { formId } = request.params as { formId: string };

    const submissions = await prisma.formSubmission.findMany({
      where: { formId },
      orderBy: { createdAt: 'desc' },
    });

    const formatted = submissions.map((s) => {
      let data = {};
      try {
        data = JSON.parse(s.dataJson);
      } catch (_) {}
      return {
        ...s,
        data,
      };
    });

    return reply.send({ success: true, submissions: formatted });
  });

  // 7. Update Submission Status & Admin Notes
  server.put('/api/projects/:projectId/forms/submissions/:submissionId/status', async (request, reply) => {
    const { submissionId } = request.params as { submissionId: string };
    const { status, adminNotes } = request.body as { status: string; adminNotes?: string };

    const updated = await prisma.formSubmission.update({
      where: { id: submissionId },
      data: {
        status,
        adminNotes: adminNotes !== undefined ? adminNotes : undefined,
      },
    });

    return reply.send({
      success: true,
      message: 'وضعیت پاسخ فرم با موفقیت به‌روزرسانی شد.',
      submission: updated,
    });
  });
};
