<template>
    <Layout>
        <div class="flex flex-col lg:flex-row lg:items-stretch w-full h-full gap-4">
            <div :class="isUploading || result?.predictions ? 'w-full lg:w-1/2' : 'w-full'" class="flex items-center justify-center">
                <div class="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md transition-all">
                    <h2 class="text-2xl font-bold mb-4">Image Upload</h2>
                    <div
                    @click="triggerFileInput"
                    @dragover.prevent="isDragging = true"
                    @dragleave="isDragging = false"
                    @drop="handleDrop"
                    class="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors"
                    :class="isDragging ? 'border-[#8B5E3C] bg-primary-light' : 'border-[#4B4B4B] hover:border-primary-dark'"
                    >
                        <input type="file" accept="image/*" @change="handleFileChange" class="hidden" ref="fileInput" />
                        <template v-if="preview">
                            <div class="relative">
                                <img :src="preview" alt="Preview" class="max-h-48 mx-auto rounded" />
                                <button
                                    @click.stop="handleRemove"
                                    class="absolute top-0 right-0 bg-[#B22222] text-white rounded-full p-1 hover:bg-[#B22222] transition-colors"
                                >
                                    <XIcon class="w-4 h-4" />
                                </button>
                            </div>
                        </template>
                        <template v-else>
                            <div class="flex flex-col items-center">
                                <UploadIcon class="w-12 h-12 text-[#4B4B4B] mb-2" />
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
                        class="cursor-pointer mt-4 w-full bg-[#A67C52] text-white py-2 rounded hover:bg-[#8B5E3C] transition"
                        >
                        {{ isUploading ? "Uploading..." : "Upload Image" }}
                    </button>
                </div>
            </div>
    
            <!-- Loading Indicator -->
            <div v-if="isUploading" class="flex items-center justify-center w-full lg:w-1/2 h-[80vh]">
                <div class="flex-col gap-4 w-full flex items-center justify-center">
                    <div
                        class="w-20 h-20 border-4 border-transparent text-[#6FAF7A] text-4xl animate-spin flex items-center justify-center border-t-[#6FAF7A] rounded-full"
                        >
                        <div
                            class="w-16 h-16 border-4 border-transparent text-[#6A8CAF] text-2xl animate-spin flex items-center justify-center border-t-[#6A8CAF] rounded-full"
                        ></div>
                    </div>
                </div>
            </div>
    
            <!-- Prediction Results Section -->
            <div v-if="result?.predictions && !isUploading" class="w-full lg:w-1/2 p-4 max-h-[80vh] overflow-auto">
                <h2 class="text-[24px] font-bold mb-2">Prediction Results</h2>
                <div v-for="(prediction, index) in result.predictions" :key="index" class="flex flex-col mb-4 gap-4">
                    <!-- Detected Image -->
                    <div class="flex items-center justify-between w-full">
                    <h3 class="text-[20px] font-bold">Detected Image</h3>
                    <button @click="toggleImageVisibility" class="text-white bg-[#8B5E3C] w-[120px] px-4 py-1.5 cursor-pointer rounded transition-colors hover:bg-primary">
                        {{ showImage ? "Hide" : "Show" }}
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
                    <div class="flex items-center justify-between gap-2">
                        <button @click="toggleGradCamVisibility(index)" class="text-white bg-[#8B5E3C] w-1/3 px-2 lg:px-4 py-1.5 cursor-pointer rounded transition-colors hover:bg-primary">
                        <span>Analysis Image</span>
                        </button>
                        <button @click="toggleConditionInfo(prediction.predicted_class)" class="text-white bg-[#D4A373] w-1/3 px-2 lg:px-4 py-1.5 cursor-pointer rounded transition-colors hover:bg-accent-dark">
                        <span>Info</span>
                        </button>
                        <button @click="chatWithCondition(prediction.predicted_class)" class="text-white bg-[#6ba174] hover:bg-[#6ba174]/90 w-1/3 px-2 lg:px-4 py-1.5 cursor-pointer rounded transition-colors">
                            Chat <span class="hidden lg:inline-block">with SkiSen</span>
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
                                class="w-20 h-20 border-4 border-transparent text-[#6FAF7A] text-4xl animate-spin flex items-center justify-center border-t-[#6FAF7A] rounded-full"
                                >
                                <div
                                    class="w-16 h-16 border-4 border-transparent text-[#6A8CAF] text-2xl animate-spin flex items-center justify-center border-t-[#6A8CAF] rounded-full"
                                ></div>
                                </div>
                            </div>
                            </div>
                            <div v-if="!isLoadingInfo && conditionInfo[prediction.predicted_class]" class="gap-4 max-h-[32vh] overflow-auto">
                                <h3 class="text-[20px] font-bold">Condition Information</h3>
                                <div v-for="(info, key) in conditionInfo[prediction.predicted_class]" :key="key" class="border-b border-[#4B4B4B] pb-4 mt-2">
                                    <button 
                                    @click="toggleConditionDetail(key, prediction.predicted_class)" 
                                    class="w-full text-left py-2 px-4 text-lg font-semibold bg-[#F5F5F5] rounded-md hover:bg-[#4B4B4B]/10 transition">
                                    {{ key }}
                                    </button>
                                    <div v-if="showConditionDetail[prediction.predicted_class][key]" class="ml-4 mt-2 text-[14px] text-neutral">
                                        <div v-if="Array.isArray(info)">
                                            <template v-if="info.length > 0 && typeof info[0] === 'object'">
                                                <ul class="list-disc ml-4">
                                                    <li v-for="(ref, i) in info" :key="i">
                                                        <a :href="ref.url" target="_blank" class="text-[#6A8CAF] hover:text-info-dark">
                                                            {{ ref.title }}
                                                        </a>
                                                    </li>
                                                </ul>
                                            </template>
                                            <template v-else>
                                                <p>{{ info.join(", ") }}</p>
                                            </template>
                                        </div>
                                        <p v-else>{{ info }}</p>
                                    </div>
                                </div>                           
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <Chatbot ref="chatbotRef" />
    </Layout>
</template>

<script setup>
import Layout from "@/Layouts/Main/Index.vue";
import { ref } from "vue";
import axios from "axios";
import { UploadIcon, XIcon } from "lucide-vue-next";
import Chatbot from '@/Components/Chatbot/Index.vue';

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

const toggleImageVisibility = () => { showImage.value = !showImage.value; };

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
        return 'text-[#6FAF7A]';
    } else if (confidence > 0.5) {
        return 'text-[#D4A373]';
    } else {
        return 'text-[#B22222]';
    }
};

const chatbotRef = ref(null);
const chatWithCondition = (condition) => {
    if (chatbotRef.value && chatbotRef.value.openChatWithCondition) {
        chatbotRef.value.openChatWithCondition(condition);
    }
};
</script>
