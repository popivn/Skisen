# Sử dụng Python 3.10 làm base image
FROM python:3.10-slim

# Cài đặt system dependencies
RUN apt-get update && apt-get install -y \
    libgl1-mesa-glx \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

# Thiết lập thư mục làm việc trong container
WORKDIR /app

# Start of Selection
RUN pip install --upgrade pip && \
    pip install fastapi==0.95.0 \
    absl-py==2.1.0 \
    annotated-types==0.7.0 \
    anthropic==0.32.0 \
    anyio==4.4.0 \
    asttokens==3.0.0 \
    astunparse==1.6.3 \
    blinker==1.9.0 \
    certifi==2024.7.4 \
    charset-normalizer==3.3.2 \
    click==8.1.7 \
    colorama==0.4.6 \
    comm==0.2.2 \
    contourpy==1.2.1 \
    cycler==0.12.1 \
    Cython==3.0.10 \
    debugpy==1.8.11 \
    decorator==5.1.1 \
    distro==1.9.0 \
    et_xmlfile==2.0.0 \
    executing==2.1.0 \
    Faker==26.1.0 \
    filelock==3.15.4 \
    Flask==3.1.0 \
    Flask-Cors==5.0.0 \
    flatbuffers==24.12.23 \
    fonttools==4.53.1 \
    fsspec==2024.6.1 \
    gast==0.6.0 \
    git-filter-repo==2.47.0 \
    google-pasta==0.2.0 \
    grpcio==1.68.1 \
    h11==0.14.0 \
    h5py==3.12.1 \
    httpcore==1.0.5 \
    httpx==0.27.0 \
    huggingface-hub==0.24.5 \
    idna==3.7 \
    imageio==2.36.1 \
    ipykernel==6.29.5 \
    ipython==8.31.0 \
    itsdangerous==2.2.0 \
    jedi==0.19.2 \
    Jinja2==3.1.4 \
    jiter==0.5.0 \
    joblib==1.4.2 \
    jupyter_client==8.6.3 \
    jupyter_core==5.7.2 \
    keras==3.7.0 \
    kiwisolver==1.4.5 \
    lazy_loader==0.4 \
    libclang==18.1.1 \
    Markdown==3.7 \
    markdown-it-py==3.0.0 \
    MarkupSafe==2.1.5 \
    matplotlib==3.9.1 \
    matplotlib-inline==0.1.7 \
    mdurl==0.1.2 \
    ml-dtypes==0.4.1 \
    mpmath==1.3.0 \
    namex==0.0.8 \
    nest-asyncio==1.6.0 \
    networkx==3.3 \
    nltk==3.8.1 \
    numpy==1.26.4 \
    openai==1.38.0 \
    opencv-python==4.10.0.84 \
    openpyxl==3.1.5 \
    opt_einsum==3.4.0 \
    optree==0.13.1 \
    packaging==24.1 \
    pandas==2.2.1 \
    parso==0.8.4 \
    patsy==0.5.6 \
    pillow==10.4.0 \
    platformdirs==4.3.6 \
    pmdarima==2.0.4 \
    prompt_toolkit==3.0.48 \
    protobuf==5.29.2 \
    psutil==6.1.1 \
    pure_eval==0.2.3 \
    py-cpuinfo==9.0.0 \
    pydantic==2.8.2 \
    pydantic_core==2.20.1 \
    Pygments==2.18.0 \
    pyparsing==3.1.2 \
    python-dateutil==2.9.0.post0 \
    pytz==2024.1 \
    PyYAML==6.0.1 \
    pyzmq==26.2.0 \
    regex==2024.7.24 \
    requests==2.32.3 \
    rich==13.9.4 \
    safetensors==0.4.3 \
    scikit-image==0.25.0 \
    scikit-learn==1.6.0 \
    scipy==1.14.0 \
    seaborn==0.13.2 \
    setuptools==72.1.0 \
    six==1.16.0 \
    sniffio==1.3.1 \
    stack-data==0.6.3 \
    statsmodels==0.14.2 \
    sympy==1.13.1 \
    tensorboard==2.18.0 \
    tensorboard-data-server==0.7.2 \
    tensorflow==2.18.0 \
    termcolor==2.5.0 \
    threadpoolctl==3.5.0 \
    tifffile==2025.1.10 \
    tokenizers==0.19.1 \
    torch==2.6.0 \
    torchvision==0.21.0 \
    tornado==6.4.2 \
    tqdm==4.66.4 \
    traitlets==5.14.3 \
    transformers==4.43.3 \
    typing_extensions==4.12.2 \
    tzdata==2024.1 \
    ucimlrepo==0.0.7 \
    ultralytics==8.3.74 \
    ultralytics-thop==2.0.14 \
    urllib3==2.2.2 \
    wcwidth==0.2.13 \
    Werkzeug==3.1.3 \
    wheel==0.45.1 \
    wrapt==1.17.0 
# End of Selection

# Copy toàn bộ code source vào container
COPY . .

# Expose cổng mà API sẽ chạy (giả sử là port 5000)
EXPOSE 5000

# Khởi chạy ứng dụng
CMD ["python", "app.py"]
