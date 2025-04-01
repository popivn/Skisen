<template>
    <div class="container mx-auto max-w-6xl py-12 px-4 md:px-6 lg:px-8">
      <h1 class="text-3xl font-bold mb-8 text-center">{{ $t('contact.title') }}</h1>
      
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div class="lg:col-span-2">
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div class="p-6 border-b border-gray-200 ">
              <h2 class="text-xl font-semibold">{{ $t('contact.form.title') }}</h2>
            </div>
            <div class="p-6">
              <div v-if="isSubmitted" class="flex flex-col items-center justify-center py-8">
                <div class="w-16 h-16 rounded-full bg-green-100  flex items-center justify-center mb-4">
                  <CheckCircleIcon class="h-8 w-8 text-green-600 " />
                </div>
                <h3 class="text-xl font-semibold mb-2">{{ $t('contact.form.success.title') }}</h3>
                <p class="text-gray-600 text-center">
                  {{ $t('contact.form.success.description') }}
                </p>
              </div>
              
              <form v-else @submit.prevent="handleSubmit" class="space-y-4">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div class="space-y-2">
                    <label for="name" class="text-sm font-medium">
                      {{ $t('contact.form.name') }}
                    </label>
                    <input
                      id="name"
                      v-model="formState.name"
                      :placeholder="$t('contact.form.name')"
                      class="w-full rounded-lg border border-gray-300  bg-white px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div class="space-y-2">
                    <label for="email" class="text-sm font-medium">
                      {{ $t('contact.form.email') }}
                    </label>
                    <input
                      id="email"
                      type="email"
                      v-model="formState.email"
                      :placeholder="$t('contact.form.email')"
                      class="w-full rounded-lg border border-gray-300  bg-white  px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>
                <div class="space-y-2">
                  <label for="subject" class="text-sm font-medium">
                    {{ $t('contact.form.subject') }}
                  </label>
                  <input
                    id="subject"
                    v-model="formState.subject"
                    :placeholder="$t('contact.form.subject')"
                    class="w-full rounded-lg border border-gray-300  bg-white  px-3 py-2 text-gray-900  focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div class="space-y-2">
                  <label for="message" class="text-sm font-medium">
                    {{ $t('contact.form.message') }}
                  </label>
                  <textarea
                    id="message"
                    v-model="formState.message"
                    :placeholder="$t('contact.form.message')"
                    rows="6"
                    class="w-full rounded-lg border border-gray-300  bg-white  px-3 py-2 text-gray-900  focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  ></textarea>
                </div>
                <button 
                  type="submit" 
                  class="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-2 flex items-center justify-center"
                  :disabled="isSubmitting"
                >
                  <template v-if="isSubmitting">
                    <span class="mr-2">{{ $t('contact.form.sending') }}</span>
                    <div class="animate-spin h-4 w-4 border-2 border-white border-opacity-50 border-t-transparent rounded-full"></div>
                  </template>
                  <template v-else>
                    {{ $t('contact.form.sendButton') }} <SendIcon class="ml-2 h-4 w-4" />
                  </template>
                </button>
              </form>
            </div>
          </div>
        </div>
        
        <div>
          <div class="bg-white  rounded-lg shadow-sm border border-gray-200  overflow-hidden mb-6">
            <div class="p-6 border-b border-gray-200 ">
              <h2 class="text-xl font-semibold">{{ $t('contact.info.title') }}</h2>
            </div>
            <div class="p-6">
              <div class="space-y-4">
                <div class="flex items-start">
                  <MailIcon class="h-5 w-5 text-blue-600  mr-3 mt-0.5" />
                  <div>
                    <h3 class="text-sm font-medium">{{ $t('contact.info.email') }}</h3>
                    <p class="text-gray-600 ">support@skisen.com</p>
                  </div>
                </div>
                <div class="flex items-start">
                  <PhoneIcon class="h-5 w-5 text-blue-600  mr-3 mt-0.5" />
                  <div>
                    <h3 class="text-sm font-medium">{{ $t('contact.info.phone') }}</h3>
                    <p class="text-gray-600 ">+84 123 456 789</p>
                  </div>
                </div>
                <div class="flex items-start">
                  <MapPinIcon class="h-5 w-5 text-blue-600  mr-3 mt-0.5" />
                  <div>
                    <h3 class="text-sm font-medium">{{ $t('contact.info.address') }}</h3>
                    <p class="text-gray-600 ">
                      Tòa nhà Innovation, 123 Đường Công Nghệ<br />
                      Quận 1, TP. Hồ Chí Minh<br />
                      Việt Nam
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div class="bg-white  rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div class="p-6 border-b border-gray-200 ">
              <h2 class="text-xl font-semibold">{{ $t('contact.hours.title') }}</h2>
            </div>
            <div class="p-6">
              <div class="space-y-2">
                <div class="flex justify-between">
                  <span class="text-gray-600 ">{{ $t('contact.hours.weekdays') }}:</span>
                  <span>8:00 - 18:00</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600 ">{{ $t('contact.hours.saturday') }}:</span>
                  <span>9:00 - 16:00</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600 ">{{ $t('contact.hours.sunday') }}:</span>
                  <span>{{ $t('contact.hours.closed') }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- FAQ Section -->
      <div class="mt-16">
        <h2 class="text-2xl font-bold mb-6">{{ $t('contact.faq.title') }}</h2>
        <div class="bg-white  rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div v-for="(faq, index) in faqs" :key="index">
            <div 
              class="p-4 border-b border-gray-200  cursor-pointer flex justify-between items-center"
              @click="toggleFaq(index)"
            >
              <h3 class="font-medium">{{ faq.question }}</h3>
              <ChevronDownIcon 
                class="h-5 w-5 transition-transform duration-200" 
                :class="{ 'transform rotate-180': openFaq === index }"
              />
            </div>
            <div 
              v-show="openFaq === index" 
              class="p-4 bg-gray-50  border-b border-gray-200 "
            >
              <p class="text-gray-600 ">{{ faq.answer }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import { Mail as MailIcon, Phone as PhoneIcon, MapPin as MapPinIcon, Send as SendIcon, CheckCircle as CheckCircleIcon, ChevronDown as ChevronDownIcon } from 'lucide-vue-next';
  
  const formState = ref({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  
  const isSubmitting = ref(false);
  const isSubmitted = ref(false);
  const openFaq = ref(null);
  
  const handleSubmit = () => {
    isSubmitting.value = true;
    
    // Simulate form submission
    setTimeout(() => {
      isSubmitting.value = false;
      isSubmitted.value = true;
      formState.value = {
        name: "",
        email: "",
        subject: "",
        message: ""
      };
      
      // Reset success message after 5 seconds
      setTimeout(() => {
        isSubmitted.value = false;
      }, 5000);
    }, 1500);
  };
  
  const toggleFaq = (index) => {
    openFaq.value = openFaq.value === index ? null : index;
  };
  
  const faqs = [
    {
      question: "SkiSen có chính xác không?",
      answer: "SkiSen sử dụng các mô hình AI tiên tiến được đào tạo trên hàng triệu hình ảnh da liễu, với độ chính xác trung bình trên 90% cho các bệnh da phổ biến. Tuy nhiên, kết quả chẩn đoán chỉ mang tính tham khảo và không thay thế cho ý kiến của bác sĩ chuyên khoa."
    },
    {
      question: "Dữ liệu của tôi có được bảo mật không?",
      answer: "Chúng tôi coi trọng quyền riêng tư của bạn. Tất cả hình ảnh được mã hóa và xử lý an toàn. Chúng tôi không lưu trữ hình ảnh của bạn trừ khi bạn đồng ý cho phép sử dụng để cải thiện mô hình AI. Bạn có thể xem chính sách bảo mật đầy đủ của chúng tôi để biết thêm chi tiết."
    },
    {
      question: "Tôi có thể sử dụng SkiSen trên điện thoại di động không?",
      answer: "Có, SkiSen được thiết kế để hoạt động trên mọi thiết bị, bao gồm điện thoại di động, máy tính bảng và máy tính để bàn. Giao diện của chúng tôi tự động điều chỉnh để mang lại trải nghiệm tốt nhất trên mọi kích thước màn hình."
    },
    {
      question: "SkiSen có thể chẩn đoán những bệnh da liễu nào?",
      answer: "SkiSen có thể nhận diện hơn 50 bệnh da liễu phổ biến, bao gồm viêm da cơ địa (eczema), vảy nến (psoriasis), mụn trứng cá (acne), nấm da (tinea), ung thư da (melanoma), và nhiều bệnh khác. Chúng tôi liên tục cập nhật mô hình AI để mở rộng danh sách bệnh có thể chẩn đoán."
    },
    {
      question: "Làm thế nào để có được kết quả chẩn đoán chính xác nhất?",
      answer: "Để có kết quả chính xác nhất, hãy chụp ảnh rõ nét, dưới ánh sáng tự nhiên, và tập trung vào vùng da bị ảnh hưởng. Tránh sử dụng bộ lọc hoặc chỉnh sửa ảnh. Nếu có thể, hãy chụp nhiều góc độ khác nhau và cung cấp thông tin về các triệu chứng kèm theo."
    }
  ];
  </script>
  
  