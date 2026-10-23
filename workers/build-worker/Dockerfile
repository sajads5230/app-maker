# ==============================================================================
# Production Cloud Build Engine Dockerfile (App Maker CI/CD Worker)
# ==============================================================================
FROM ubuntu:22.04

ENV DEBIAN_FRONTEND=noninteractive

# Install prerequisites
RUN apt-get update && apt-get install -y \
    curl \
    git \
    unzip \
    xz-utils \
    zip \
    libglu1-mesa \
    openjdk-17-jdk \
    nodejs \
    npm \
    && rm -rf /var/lib/apt/lists/*

# Setup Java
ENV JAVA_HOME="/usr/lib/jvm/java-17-openjdk-amd64"
ENV PATH="${JAVA_HOME}/bin:${PATH}"

# Install Android SDK
ENV ANDROID_SDK_ROOT="/opt/android-sdk"
ENV ANDROID_CMD_TOOLS_VERSION="11076708"
RUN mkdir -p ${ANDROID_SDK_ROOT}/cmdline-tools && \
    curl -o /tmp/cmdline-tools.zip https://dl.google.com/android/repository/commandlinetools-linux-${ANDROID_CMD_TOOLS_VERSION}_latest.zip && \
    unzip -q /tmp/cmdline-tools.zip -d ${ANDROID_SDK_ROOT}/cmdline-tools && \
    mv ${ANDROID_SDK_ROOT}/cmdline-tools/cmdline-tools ${ANDROID_SDK_ROOT}/cmdline-tools/latest && \
    rm /tmp/cmdline-tools.zip

ENV PATH="${ANDROID_SDK_ROOT}/cmdline-tools/latest/bin:${ANDROID_SDK_ROOT}/platform-tools:${PATH}"

# Accept Android licenses and install platform tools
RUN yes | sdkmanager --licenses && \
    sdkmanager "platform-tools" "platforms;android-34" "build-tools;34.0.0"

# Install Flutter SDK
ENV FLUTTER_ROOT="/opt/flutter"
RUN git clone -b stable https://github.com/flutter/flutter.git ${FLUTTER_ROOT}
ENV PATH="${FLUTTER_ROOT}/bin:${PATH}"

# Run Flutter doctor to complete setup
RUN flutter doctor -v

WORKDIR /workspace/workers/build-worker

# Install dependencies and start worker
COPY package.json ./
RUN npm install

COPY . .
RUN npm run build

CMD ["npm", "start"]
