<template>
    <Layout>
        <div class="flex items-stretch w-full h-full">
            <div :class="isUploading || result?.predictions ? 'w-1/2' : 'w-full'" class="flex items-center justify-center">
                <div class="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md transition-all">
                    <h2 class="text-2xl font-bold mb-4">Image Upload</h2>
                    <div
                    @click="triggerFileInput"
                    @dragover.prevent="isDragging = true"
                    @dragleave="isDragging = false"
                    @drop="handleDrop"
                    class="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors"
                    :class="isDragging ? 'border-primary-dark bg-primary-light' : 'border-neutral hover:border-primary-dark'"
                    >
                        <input type="file" accept="image/*" @change="handleFileChange" class="hidden" ref="fileInput" />
                        <template v-if="preview">
                            <div class="relative">
                                <img :src="preview" alt="Preview" class="max-h-48 mx-auto rounded" />
                                <button
                                    @click.stop="handleRemove"
                                    class="absolute top-0 right-0 bg-danger text-white rounded-full p-1 hover:bg-danger transition-colors"
                                >
                                    <XIcon class="w-4 h-4" />
                                </button>
                            </div>
                        </template>
                        <template v-else>
                            <div class="flex flex-col items-center">
                                <UploadIcon class="w-12 h-12 text-neutral mb-2" />
                                <p class="text-neutral">Drag & drop an image here, or click to select</p>
                            </div>
                        </template>
                    </div>
        
                    <!-- File Info -->
                    <div v-if="file && !isUploading" class="mt-4">
                        <p class="text-sm text-neutral">
                            {{ file.name }} ({{ (file.size / 1024 / 1024).toFixed(2) }} MB)
                        </p>
                    </div>
        
                    <!-- Upload Button -->
                    <button
                        @click="uploadImage"
                        :disabled="!file || isUploading"
                        class="cursor-pointer mt-4 w-full bg-primary text-white py-2 rounded hover:bg-primary-dark transition"
                        >
                        {{ isUploading ? "Uploading..." : "Upload Image" }}
                    </button>
                </div>
            </div>
    
            <!-- Loading Indicator -->
            <div v-if="isUploading" class="flex items-center justify-center w-1/2 h-[80vh]">
                <div class="flex-col gap-4 w-full flex items-center justify-center">
                    <div
                        class="w-20 h-20 border-4 border-transparent text-success text-4xl animate-spin flex items-center justify-center border-t-success rounded-full"
                        >
                        <div
                            class="w-16 h-16 border-4 border-transparent text-info text-2xl animate-spin flex items-center justify-center border-t-info rounded-full"
                        ></div>
                    </div>
                </div>
            </div>
    
            <!-- Prediction Results Section -->
            <div v-if="result?.predictions && !isUploading" class="w-1/2 p-4 max-h-[80vh] overflow-auto">
                <h2 class="text-[24px] font-bold mb-2">Prediction Results</h2>
                <div v-for="(prediction, index) in result.predictions" :key="index" class="flex flex-col mb-4 gap-4">
                    <!-- Detected Image -->
                    <div class="flex items-center justify-between w-full">
                    <h3 class="text-[20px] font-bold">Detected Image</h3>
                    <button @click="toggleImageVisibility" class="text-white bg-primary-dark w-[120px] px-4 py-1.5 cursor-pointer rounded transition-colors hover:bg-primary">
                        {{ showImage ? "Hide Image" : "Show Image" }}
                    </button>
                    </div>
                    <img v-if="showImage" :src="result.imageDetected" alt="Detected Image" class="max-w-1/2 rounded mb-4 mx-auto" />
        
                    <!-- Prediction and Confidence -->
                    <div>
                    <p class="font-semibold">
                        Prediction: 
                        <span class="text-accent">{{ prediction.predicted_class }}</span>
                    </p>
                    <p class="font-semibold">
                        Confidence: 
                        <span :class="getConfidenceClass(prediction.confidence)">
                        {{ (prediction.confidence).toFixed(2) }}%
                        </span>
                    </p>
                    <p class="mt-2 text-neutral">
                        Based on the analysis, the condition is predicted to be <strong>{{ prediction.predicted_class }}</strong> with a confidence of <strong>{{ (prediction.confidence).toFixed(2) }}%</strong>.
                        <span v-if="prediction.confidence < 0.5" class="text-danger">This result has low confidence, further validation is recommended.</span>
                        <span v-else-if="prediction.confidence < 0.8" class="text-warning">The prediction is moderately confident, but further analysis may be helpful.</span>
                        <span v-else class="text-success">This prediction is highly confident, suggesting a strong diagnosis.</span>
                    </p>
                    </div>
        
                    <!-- Grad-CAM & Condition Info -->
                    <div>
                    <div class="flex items-center justify-between">
                        <button @click="toggleGradCamVisibility(index)" class="text-white bg-primary-dark w-[200px] px-4 py-1.5 cursor-pointer rounded transition-colors hover:bg-primary">
                        {{ showGradCam[index] ? "Hide Analysis Image" : "Show Analysis Image" }}
                        </button>
                        <button @click="toggleConditionInfo(prediction.predicted_class)" class="text-white bg-accent w-[200px] px-4 py-1.5 cursor-pointer rounded transition-colors hover:bg-accent-dark">
                        {{ showConditionInfo[prediction.predicted_class] ? "Hide Info" : "Show Info" }}
                        </button>
                    </div>
        
                    <!-- Grad-CAM Image -->
                    <div v-if="showGradCam[index]" class="mt-4">
                        <img :src="prediction?.gradcam_image" alt="Grad-CAM Image" class="max-w-full rounded mb-4 mx-auto" />
                        <p class="text-sm text-neutral">
                        <b><i>Explanation:</i></b> {{ prediction?.gradcam_explanation }}
                        </p>
                    </div>
        
                    <!-- Condition Info -->
                    <div v-if="showConditionInfo[prediction.predicted_class]" class="mt-4">
                        <div v-if="isLoadingInfo && !conditionInfo[prediction.predicted_class]" class="mt-4">
                        <div class="flex-col gap-4 w-full flex items-center justify-center">
                            <div
                            class="w-20 h-20 border-4 border-transparent text-success text-4xl animate-spin flex items-center justify-center border-t-success rounded-full"
                            >
                            <div
                                class="w-16 h-16 border-4 border-transparent text-info text-2xl animate-spin flex items-center justify-center border-t-info rounded-full"
                            ></div>
                            </div>
                        </div>
                        </div>
                        <div v-if="!isLoadingInfo && conditionInfo[prediction.predicted_class]" class="gap-4 max-h-[32vh] overflow-auto">
                        <h3 class="text-[20px] font-bold">Condition Information</h3>
                        <div v-for="(info, key) in conditionInfo[prediction.predicted_class]" :key="key" class="border-b border-neutral pb-4 mt-2">
                            <button 
                            @click="toggleConditionDetail(key, prediction.predicted_class)" 
                            class="w-full text-left py-2 px-4 text-lg font-semibold bg-neutral-light rounded-md hover:bg-neutral transition">
                            {{ key }}
                            </button>
                            <div v-if="showConditionDetail[prediction.predicted_class][key]" class="ml-4 mt-2 text-[14px] text-neutral">
                            <p v-if="Array.isArray(info)">{{ info.join(", ") }}</p>
                            <p v-else>{{ info }}</p>
                            </div>
                        </div>
                        <div class="mt-4">
                            <h5 class="text-lg font-bold">References</h5>
                            <ul class="list-disc pl-6">
                            <li v-for="ref in conditionInfo[prediction.predicted_class].References" :key="ref.url">
                                <a :href="ref.url" target="_blank" class="underline text-info hover:text-info-dark">{{ ref.title }}</a>
                            </li>
                            </ul>
                        </div>
                        </div>
                    </div>
                    </div>
                </div>
            </div>
        </div>
    </Layout>
</template>

<script setup>
import Layout from "@/Layouts/Main/Index.vue";
import { ref } from "vue";
import axios from "axios";
import { UploadIcon, XIcon } from "lucide-vue-next";

const file = ref(null);
const preview = ref(null);
const isDragging = ref(false);
const fileInput = ref(null);
const result = ref({});
const isUploading = ref(false);
const showImage = ref(false); 
const showGradCam = ref([]); 
const conditionInfo = ref({});
const showConditionInfo = ref({});
const showConditionDetail = ref({})
const isLoadingInfo = ref(false);

const triggerFileInput = () => fileInput.value.click();

const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
        file.value = selectedFile;
        preview.value = URL.createObjectURL(selectedFile);
    }
};

const handleDrop = (event) => {
    event.preventDefault();
    isDragging.value = false;
    const selectedFile = event.dataTransfer.files[0];
    if (selectedFile) {
        file.value = selectedFile;
        preview.value = URL.createObjectURL(selectedFile);
    }
};

const handleRemove = () => {
    file.value = null;
    preview.value = null;
};

const uploadImage = async () => {
    if (!file.value) return;

    const formData = new FormData();
    formData.append("image", file.value);

    isUploading.value = true;

    try {
        const response = await axios.post("http://localhost:3000/predict", formData, {
            headers: { "Content-Type": "multipart/form-data" }
        });

        result.value = response.data;
    } catch (error) {
        console.error("Upload error:", error);
    } finally {
        isUploading.value = false;
    }
};

const fetchConditionInfo = async (condition) => {
    try {
        isLoadingInfo.value = true;
        if (!conditionInfo.value[condition]) {
            const response = await axios.post("http://localhost:3000/explain", { condition });
            conditionInfo.value = { ...conditionInfo.value, [condition]: response.data };

            showConditionDetail.value[condition] = Object.fromEntries(
                Object.keys(response.data).map(key => [key, false])
            );
        }
    } catch (error) {
        console.error("Error fetching condition info:", error);
    } finally {
        isLoadingInfo.value = false;
    }
};

const toggleImageVisibility = () => {
    showImage.value = !showImage.value;
};

const toggleGradCamVisibility = (index) => {
    showGradCam.value[index] = !showGradCam.value[index];
};

const toggleConditionInfo = (condition) => {
    showConditionInfo.value[condition] = !showConditionInfo.value[condition];
    fetchConditionInfo(condition);
};

const toggleConditionDetail = (key, condition) => {
    if (!showConditionDetail.value[condition]) {
        showConditionDetail.value[condition] = {};
    }
    showConditionDetail.value[condition][key] = !showConditionDetail.value[condition][key];
};

const getConfidenceClass = (confidence) => {
    if (confidence > 0.8) {
        return 'text-success';
    } else if (confidence > 0.5) {
        return 'text-warning';
    } else {
        return 'text-danger';
    }
};
</script>

<style scoped>
.bg-primary {
    background-color: #A67C52;
}
.bg-primary-dark {
    background-color: #8B5E3C;
}
.bg-primary-light {
    background-color: #E6D4C1;
}

.bg-accent {
    background-color: #D4A373;
}
.bg-accent-dark {
    background-color: #B17B55;
}

.bg-success {
    background-color: #6FAF7A;
}
.bg-warning {
    background-color: #D9A441;
}
.bg-danger {
    background-color: #B22222;
}

.text-success {
    color: #6FAF7A;
}
.text-warning {
    color: #D9A441;
}
.text-danger {
    color: #B22222;
}
.text-info {
    color: #6A8CAF;
}
.text-info-dark {
    color: #3E6B8E;
}

/* Spinner border colors */
.border-t-success {
    border-top-color: #6FAF7A;
}
.border-t-info {
    border-top-color: #6A8CAF;
}

/* Custom Neutral Colors */
.text-neutral {
    color: #4B4B4B;
}
.border-neutral {
    border-color: #A3A3A3;
}
.bg-neutral-light {
    background-color: #F5F5F5;
}
</style>
