<template>
  <div class="container mx-auto max-w-7xl py-12 px-4 md:px-6 lg:px-8">
    <h1 class="text-3xl font-bold mb-8 text-center">{{ $t('diagnosis.title') }}</h1>
    
    <div
      v-if="!image"
      class="border-2 border-dashed p-8 text-center rounded-lg"
      :class="isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 '"
      @dragover.prevent="handleDragOver"
      @dragleave="handleDragLeave"
      @drop.prevent="handleDrop"
    >
      <div class="pt-6 flex flex-col items-center">
        <div class="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center mb-6">
          <UploadIcon class="h-10 w-10 text-blue-600" />
        </div>
        <h2 class="text-xl font-semibold mb-2">{{ $t('diagnosis.upload.title') }}</h2>
        <p class="text-gray-600 mb-6 max-w-md">
          {{ $t('diagnosis.upload.description') }}
        </p>
        <div class="flex flex-col sm:flex-row gap-4">
          <button
            @click="triggerFileInput"
            class="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-6 py-3 flex items-center"
          >
            <UploadIcon class="mr-2 h-5 w-5" /> {{ $t('diagnosis.upload.uploadButton') }}
          </button>
          <button
            @click="openCamera"
            class="border border-gray-300 text-gray-700 hover:bg-gray-100 rounded-lg px-6 py-3 flex items-center"
          >
            <CameraIcon class="mr-2 h-5 w-5" /> {{ $t('diagnosis.upload.captureButton') }}
          </button>
        </div>
        <input
          type="file"
          ref="fileInputRef"
          @change="handleFileInput"
          accept="image/*"
          class="hidden"
        />
        <p class="text-sm text-gray-500 mt-6">
          {{ $t('diagnosis.upload.formats') }}
        </p>
      </div>

      <!-- Camera section -->
      <div v-if="isCameraActive" class="relative mt-4">
        <video ref="videoElement" class="w-full h-auto" autoplay></video>
        <div class="absolute bottom-0 left-0 right-0 p-4 text-center">
          <button
            @click="capturePhoto"
            class="bg-blue-600 text-white px-6 py-3 rounded-lg"
          >
            {{ $t('diagnosis.upload.captureButton') }}
          </button>
        </div>
      </div>
    </div>

    <!-- Image preview section -->
    <div v-else class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div class="relative">
          <img :src="preview" alt="Uploaded skin image" class="w-full h-auto" />
        </div>
        <div class="p-4 flex justify-between">
          <button
            class="border border-gray-300 text-gray-700 hover:bg-gray-100 rounded-lg px-4 py-2"
            @click="resetImage"
          >
            {{ $t('diagnosis.result.uploadAnother') }}
          </button>
        </div>
      </div>

      <div>
        <div
          v-if="isAnalyzing"
          class="bg-white p-8 h-full flex flex-col items-center justify-center rounded-lg shadow-sm border border-gray-200"
        >
          <Loader2Icon class="h-12 w-12 text-blue-600 animate-spin mb-4" />
          <h2 class="text-xl font-semibold mb-2">{{ $t('diagnosis.analyzing.title') }}</h2>
          <p class="text-gray-600 text-center">
            {{ $t('diagnosis.analyzing.description') }}
          </p>
        </div>

        <div v-else-if="result && result.predictions.length > 0" class="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <!-- Detected Image Section -->
          <div v-if="result.imageDetected" class="mb-6 border border-gray-200 rounded-lg overflow-hidden">
            <div 
              class="p-4 bg-gray-50 flex items-center justify-between cursor-pointer"
              @click="showDetectedImage = !showDetectedImage"
            >
              <h3 class="text-lg font-semibold">{{ $t('diagnosis.result.detectedImage') }}</h3>
              <ChevronDownIcon 
                class="h-5 w-5 text-gray-500 transition-transform duration-200"
                :class="{ 'transform rotate-180': showDetectedImage }"
              />
            </div>
            <div v-show="showDetectedImage" class="p-4">
              <img :src="imageDetected" alt="Detected Image" class="w-full rounded-lg" />
              <p class="mt-3 text-gray-600">{{ $t('diagnosis.result.detectedImageDescription') }}</p>
            </div>
          </div>

          <!-- Dropdown accordion for each prediction -->
          <div v-for="(prediction, index) in result.predictions" :key="index" class="mb-4 border border-gray-200 rounded-lg overflow-hidden">
            <!-- Prediction header (always visible) -->
            <div 
              class="p-4 bg-gray-50 flex items-center justify-between cursor-pointer"
              @click="togglePrediction(index)"
            >
              <div class="flex items-center">
                <h2 class="text-xl font-bold text-gray-900">{{ prediction.predicted_class }}</h2>
                <div class="ml-3 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                  {{ Math.round(prediction.confidence) }}% {{ $t('diagnosis.result.accuracy') }}
                </div>
              </div>
              <ChevronDownIcon 
                class="h-5 w-5 text-gray-500 transition-transform duration-200"
                :class="{ 'transform rotate-180': openPredictions[index] }"
              />
            </div>
            
            <!-- Prediction details (expandable) -->
            <div 
              v-show="openPredictions[index]"
              class="p-4 border-t border-gray-200"
            >
              <!-- GradCam Image Section with toggle -->
              <div v-if="prediction.gradcam_image" class="mb-6 border border-gray-200 rounded-lg overflow-hidden">
                <div 
                  class="p-3 bg-gray-50 flex items-center justify-between cursor-pointer"
                  @click="toggleGradcamVisibility(index)"
                >
                  <h3 class="text-lg font-semibold">{{ $t('diagnosis.result.visualExplanation') }}</h3>
                  <ChevronDownIcon 
                    class="h-5 w-5 text-gray-500 transition-transform duration-200"
                    :class="{ 'transform rotate-180': gradcamVisibility[index] }"
                  />
                </div>
                <div v-show="gradcamVisibility[index]" class="p-3">
                  <img :src="prediction.gradcam_image" alt="GradCam Explanation" class="w-full rounded-lg" />
                  <p class="mt-3 text-gray-600">{{ $t('diagnosis.result.highlightedRegionsText', { predicted_label: prediction.predicted_class }) }}</p>
                </div>
              </div>
            
              <!-- Detailed condition info section -->
              <div v-if="conditionInfo[prediction.predicted_class]" class="mt-6 mb-6 border border-gray-200 rounded-lg overflow-hidden">
                <div 
                  class="p-4 bg-blue-50 border-b border-gray-200 flex items-center justify-between cursor-pointer"
                  @click="toggleDetailedInfo(prediction.predicted_class)"
                >
                  <h3 class="text-lg font-semibold text-blue-800">{{ $t('diagnosis.result.detailedInfo') }}</h3>
                  <ChevronDownIcon 
                    class="h-5 w-5 text-blue-600 transition-transform duration-200"
                    :class="{ 'transform rotate-180': showDetailedInfo[prediction.predicted_class] }"
                  />
                </div>
                
                <div v-show="showDetailedInfo[prediction.predicted_class]">
                  <!-- Loop through each section of the condition info -->
                  <div v-for="(content, key) in conditionInfo[prediction.predicted_class]" :key="key" class="border-b border-gray-200 last:border-b-0">
                    <!-- Skip References section as it will be displayed differently -->
                    <template v-if="key !== referencesKey ">
                      <div 
                        class="p-3 bg-gray-50 flex items-center justify-between cursor-pointer"
                        @click="toggleConditionSection(prediction.predicted_class, key)"
                      >
                        <h4 class="font-medium">{{ key }}</h4>
                        <ChevronDownIcon 
                          class="h-5 w-5 text-gray-500 transition-transform duration-200"
                          :class="{ 'transform rotate-180': showConditionDetail[prediction.predicted_class]?.[key] }"
                        />
                      </div>
                      <div v-show="showConditionDetail[prediction.predicted_class]?.[key]" class="p-4">
                        <!-- Handle array content (like Symptoms) -->
                        <ul v-if="Array.isArray(content)" class="list-disc pl-5 space-y-1">
                          <li v-for="(item, i) in content" :key="i" class="text-gray-600">
                            {{ item }}
                          </li>
                        </ul>
                        <!-- Handle string content -->
                        <p v-else class="text-gray-600">{{ content }}</p>
                      </div>
                    </template>
                  </div>
                  
                  <!-- Reference section -->
                  <div v-if="conditionInfo[prediction.predicted_class][referencesKey]" class="border-b border-gray-200 last:border-b-0">
                    <div 
                      class="p-3 bg-gray-50 flex items-center justify-between cursor-pointer"
                      @click="toggleConditionSection(prediction.predicted_class, referencesKey)"
                    >
                      <h4 class="font-medium">{{ $t('diagnosis.result.references') }}</h4>
                      <ChevronDownIcon 
                        class="h-5 w-5 text-gray-500 transition-transform duration-200"
                        :class="{ 'transform rotate-180': showConditionDetail[prediction.predicted_class]?.[referencesKey] }"
                      />
                    </div>
                    <div v-show="showConditionDetail[prediction.predicted_class]?.[referencesKey]" class="p-4">
                      <ul class="space-y-2">
                        <li v-for="(ref, i) in conditionInfo[prediction.predicted_class][referencesKey]" :key="i" class="text-blue-600">
                          <a :href="ref.url" target="_blank" class="hover:underline flex items-center">
                            <ExternalLinkIcon class="h-4 w-4 mr-1" />
                            {{ ref.title }}
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              
              <div class="flex flex-col sm:flex-row gap-4 mt-6">
                <button 
                  @click="fetchConditionInfo(prediction.predicted_class)"
                  class="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-2 flex items-center justify-center"
                  :disabled="isLoadingInfo[prediction.predicted_class]"
                >
                  <span v-if="!isLoadingInfo[prediction.predicted_class]">
                    {{ $t('diagnosis.result.learnMore', { predicted_label: prediction.predicted_class }) }}
                  </span>
                  <span v-else class="flex items-center">
                    <Loader2Icon class="h-4 w-4 animate-spin mr-2" />
                    {{ $t('diagnosis.result.loading') }}
                  </span>
                </button>
                <button class="border border-gray-300 text-gray-700 hover:bg-gray-100 rounded-lg px-4 py-2" @click="openChatModal(prediction.predicted_class)">
                  {{ $t('diagnosis.result.askAI') }}
                </button>
              </div>
            </div>
          </div>
          
          <!-- Doctor consultation recommendation -->
          <div class="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div class="flex">
              <AlertCircleIcon class="h-5 w-5 text-yellow-600 mr-2 flex-shrink-0" />
              <div>
                <h4 class="text-sm font-medium text-yellow-800">{{ $t('diagnosis.result.doctorWarning.title') }}</h4>
                <p class="text-sm text-yellow-700 mt-1">
                  {{ $t('diagnosis.result.doctorWarning.description') }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div v-else-if="result && result.status === 'error'" class="bg-white p-8 h-full flex flex-col items-center justify-center rounded-lg shadow-sm border border-gray-200">
          <h2 class="text-xl font-semibold mb-2">{{ $t('diagnosis.noCondition.title') }}</h2>
          <p class="text-gray-600 text-center mb-6">
            {{ $t('diagnosis.noCondition.description') }}
          </p>
          <button
            @click="resetImage"
            class="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-6 py-3 text-lg"
          >
            {{ $t('diagnosis.noCondition.button') }}
          </button>
        </div>

        <div v-else class="bg-white p-8 h-full flex flex-col items-center justify-center rounded-lg shadow-sm border border-gray-200">
          <h2 class="text-xl font-semibold mb-2">{{ $t('diagnosis.ready.title') }}</h2>
          <p class="text-gray-600 text-center mb-6">
            {{ $t('diagnosis.ready.description') }}
          </p>
          <button
            @click="analyzeImage"
            class="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-6 py-3 text-lg"
          >
            {{ $t('diagnosis.ready.button') }}
          </button>
        </div>
      </div>
    </div>
    <!-- Chatbot Modal -->
    <div v-if="showChatModal" class="fixed inset-0 bg-black/60 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-lg shadow-xl w-full max-w-2xl overflow-hidden flex flex-col">
        <!-- Modal Header -->
        <div class="p-4 border-b border-gray-200 flex justify-between items-center">
          <h3 class="text-xl font-semibold text-gray-900">
            {{ $t('diagnosis.chatModal.title', { condition: currentCondition }) }}
          </h3>
          <button @click="closeChatModal" class="text-gray-400 hover:text-gray-500">
            <XIcon class="h-6 w-6" />
          </button>
        </div>
        
        <!-- AIDoctor Component -->
        <div class="flex-1">
          <AIDoctor ref="aiDoctorRef" />
        </div>
      </div>
    </div>

    <div v-if="showCropper" class="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-lg shadow-xl w-full max-w-2xl overflow-hidden">
        <div class="p-4 border-b border-gray-200 flex justify-between items-center">
          <h3 class="text-xl font-semibold text-gray-900">
            {{ $t('diagnosis.crop.title') }}
          </h3>
          <button @click="cancelCropping" class="text-gray-400 hover:text-gray-500">
            <XIcon class="h-6 w-6" />
          </button>
        </div>
        <div class="p-4">
          <ImageCropper 
            :image="imageToEdit" 
            @crop="handleCroppedImage" 
            @cancel="cancelCropping" 
          />
        </div>
      </div>
    </div>
    <div v-if="showConsentDialog" class="fixed inset-0 bg-black/60 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
        <h3 class="text-xl font-semibold mb-4">{{ $t('diagnosis.consent.title') }}</h3>
        <p class="mb-4 text-gray-600">{{ $t('diagnosis.consent.description') }}</p>
        <p class="mb-4 text-gray-600 ">{{ $t('diagnosis.consent.dataUsage') }}</p>
        <div class="flex flex-col sm:flex-row gap-3 justify-end mt-6">
          <button 
            @click="showConsentDialog = false" 
            class="border border-gray-300  text-gray-700  hover:bg-gray-100 rounded-lg px-4 py-2"
          >
            {{ $t('diagnosis.consent.decline') }}
          </button>
          <button 
            @click="giveConsent" 
            class="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-2"
          >
            {{ $t('diagnosis.consent.accept') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onBeforeUnmount, nextTick, reactive, onMounted } from 'vue';
import {
  Upload as UploadIcon,
  Camera as CameraIcon,
  Loader2 as Loader2Icon,
  ChevronDown as ChevronDownIcon,
  AlertCircle as AlertCircleIcon,
  ExternalLink as ExternalLinkIcon,
  X as XIcon
} from 'lucide-vue-next';
import axios from 'axios';
import AIDoctor from '@/Components/AIDoctor/Index.vue';
import ImageCropper from '@/Components/ImageCropper/Index.vue';

const image = ref(null);
const preview = ref(null);
const isDragging = ref(false);
const isAnalyzing = ref(false);
const isCameraActive = ref(false);
const videoElement = ref(null);
const progress = ref(0);
const result = ref(null);
const fileInputRef = ref(null);
const openPredictions = reactive({});
const imageDetected = ref(null);
const showDetectedImage = ref(true);
const gradcamVisibility = reactive({});
const conditionInfo = reactive({});
const isLoadingInfo = reactive({});
const showConditionDetail = reactive({});
const showDetailedInfo = reactive({});
const showChatModal = ref(false);
const currentCondition = ref('');
const aiDoctorRef = ref(null);
const showCropper = ref(false);
const imageToEdit = ref(null);
const hasConsent = ref(false);
const showConsentDialog = ref(false);

const togglePrediction = (index) => {
  openPredictions[index] = !openPredictions[index];
};

const toggleGradcamVisibility = (index) => {
  gradcamVisibility[index] = !gradcamVisibility[index];
};

const toggleConditionSection = (condition, section) => {
  if (!showConditionDetail[condition]) {
    showConditionDetail[condition] = {};
  }
  showConditionDetail[condition][section] = !showConditionDetail[condition][section];
};

const toggleDetailedInfo = (condition) => {
  showDetailedInfo[condition] = !showDetailedInfo[condition];
};

const fetchConditionInfo = async (condition) => {
  try {
    const language = localStorage.getItem("language") || "en";
    isLoadingInfo[condition] = true;
    
    if (!conditionInfo[condition]) {
      console.log("Fetching condition info for:", condition);
      const response = await axios.post("http://localhost:3000/explain", { condition, language });
      conditionInfo[condition] = response.data;
      
      showConditionDetail[condition] = Object.fromEntries(
        Object.keys(response.data).map(key => [key, false])
      );
      
      const firstSection = Object.keys(response.data)[0];
      if (firstSection) {
        showConditionDetail[condition][firstSection] = true;
      }

      showDetailedInfo[condition] = true;
    }
  } catch (error) {
    console.error("Error fetching condition info:", error);
  } finally {
    isLoadingInfo[condition] = false;
  }
};

const handleDragOver = (e) => {
  e.preventDefault();
  isDragging.value = true;
};

const handleDragLeave = () => {
  isDragging.value = false;
};

const handleDrop = (e) => {
  e.preventDefault();
  isDragging.value = false;
  if (e.dataTransfer.files && e.dataTransfer.files[0]) {
    handleFile(e.dataTransfer.files[0]);
  }
};

const handleFileInput = (e) => {
  if (e.target.files && e.target.files[0]) {
    handleFile(e.target.files[0]);
  }
};

const handleFile = (file) => {
  const reader = new FileReader();
  reader.onload = (e) => {
    imageToEdit.value = e.target.result; // Hiển thị ảnh trong cropper
    showCropper.value = true; // Mở cropper
  };
  reader.readAsDataURL(file);
};

const handleCroppedImage = (croppedImage) => {
  image.value = croppedImage; // Lưu ảnh đã crop
  preview.value = croppedImage; // Hiển thị preview
  showCropper.value = false; // Ẩn cropper
  
  // Chuyển base64 thành file object để upload
  fetch(croppedImage)
    .then(res => res.blob())
    .then(blob => {
      const file = new File([blob], "cropped-image.jpg", { type: "image/jpeg" });
      image.value = file; // Cập nhật image để upload
    });
};

const cancelCropping = () => {
  showCropper.value = false;
  imageToEdit.value = null;
  image.value = null;
  preview.value = null;
};

const uploadImage = async () => {
  if (!image.value) {
    console.error("No image to upload!");
    return;
  }

  const formData = new FormData();
  formData.append("image", image.value);

  isAnalyzing.value = true;
  progress.value = 0;
  result.value = null;
  imageDetected.value = null; // Đặt lại imageDetected trước khi upload

  try {
    const response = await axios.post("http://localhost:3000/predict", formData, {
      headers: { "Content-Type": "multipart/form-data" },
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total) {
          progress.value = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        }
      }
    });

    result.value = response.data;
    imageDetected.value = response.data.imageDetected; // Cập nhật imageDetected với dữ liệu mới
  } catch (error) {
    console.error("Upload error:", error);
  } finally {
    isAnalyzing.value = false;
  }
};

const analyzeImage = () => {
  if (!hasConsent.value) {
    showConsentDialog.value = true;
    return;
  }
  uploadImage();
};

const resetImage = () => {
  image.value = null;
  preview.value = null;
  isCameraActive.value = false;
  result.value = null;
  imageDetected.value = null; // Đặt lại imageDetected khi reset

  Object.keys(openPredictions).forEach(key => delete openPredictions[key]);
  Object.keys(gradcamVisibility).forEach(key => delete gradcamVisibility[key]);
  Object.keys(conditionInfo).forEach(key => delete conditionInfo[key]);
  Object.keys(isLoadingInfo).forEach(key => delete isLoadingInfo[key]);
  Object.keys(showConditionDetail).forEach(key => delete showConditionDetail[key]);
  Object.keys(showDetailedInfo).forEach(key => delete showDetailedInfo[key]);
  
  nextTick(() => {
    triggerFileInput();
  });
};

const triggerFileInput = () => {
  fileInputRef.value.click();
};

const openCamera = async () => {
  isCameraActive.value = true;
  await nextTick();
  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoElement.value) {
        videoElement.value.srcObject = stream;
      } else {
        console.error("Video element not found after nextTick.");
      }
    } catch (error) {
      console.error("Camera access denied:", error);
      alert("Camera access is denied. Please enable camera access in your browser settings.");
      isCameraActive.value = false;
    }
  } else {
    alert("Camera not supported on this device or browser.");
    isCameraActive.value = false;
  }
};

const capturePhoto = () => {
  if (videoElement.value) {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    const video = videoElement.value;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    const base64Image = canvas.toDataURL("image/png");
    preview.value = base64Image;
    isCameraActive.value = false;

    const stream = video.srcObject;
    const tracks = stream.getTracks();
    tracks.forEach((track) => track.stop());

    imageToEdit.value = base64Image; // Gán ảnh chụp vào imageToEdit
    showCropper.value = true; // Mở cropper
  }
};

onBeforeUnmount(() => {
  if (videoElement.value && videoElement.value.srcObject) {
    const stream = videoElement.value.srcObject;
    const tracks = stream.getTracks();
    tracks.forEach((track) => track.stop());
  }
});

const referencesKey = computed(() => {
  return localStorage.getItem('language') === 'vi' ? 'Tài liệu tham khảo' : 'References';
});

const openChatModal = async (condition) => {
  currentCondition.value = condition;
  showChatModal.value = true;
  
  await nextTick();
  
  if (aiDoctorRef.value) {
    aiDoctorRef.value.openChatWithCondition(condition);
  }
};

const closeChatModal = () => {
  showChatModal.value = false;
  currentCondition.value = '';
};

const giveConsent = () => {
  hasConsent.value = true;
  showConsentDialog.value = false;
  localStorage.setItem('imageProcessingConsent', 'true');
  uploadImage();
};

onMounted(() => {
  const savedConsent = localStorage.getItem('imageProcessingConsent');
  if (savedConsent === 'true') {
    hasConsent.value = true;
  }
});
</script>