// Web3Forms Access Key for KD Fertilizer Association (kdfpea@gmail.com)
const WEB3FORMS_ACCESS_KEY = "eeb6dc42-d151-4214-bef7-138dae9ccaec";

document.addEventListener('DOMContentLoaded', () => {
  console.log('KD Fertilizer Association script loaded successfully.');

  // Header scroll dynamic background/shadow
  const header = document.querySelector('header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.style.boxShadow = '0 10px 30px rgba(16, 34, 23, 0.08)';
      header.style.borderBottomColor = 'rgba(31, 122, 63, 0.15)';
    } else {
      header.style.boxShadow = 'none';
      header.style.borderBottomColor = 'rgba(31, 122, 63, 0.08)';
    }
  });
});

// Toggle Contact Form visibility
function toggleContactForm(show) {
  const formContainer = document.getElementById('contactFormContainer');
  const inquiryBtn = document.getElementById('inquiryBtn');
  
  if (show) {
    formContainer.style.display = 'block';
    inquiryBtn.style.display = 'none';
    
    // Smooth scroll to the form with offset
    setTimeout(() => {
      formContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
  } else {
    formContainer.style.display = 'none';
    inquiryBtn.style.display = 'inline-flex';
    document.getElementById('contactForm').reset();
  }
}

// Submit Inquiry to Web3Forms API
async function sendInquiry(event) {
  event.preventDefault();
  
  const form = document.getElementById('contactForm');
  const submitBtn = document.getElementById('submitBtn');
  
  const email = form.querySelector('[name="email"]').value;
  const subject = form.querySelector('[name="subject"]').value;
  const message = form.querySelector('[name="message"]').value;
  
  const originalBtnText = submitBtn.innerHTML;
  submitBtn.disabled = true;
  submitBtn.innerHTML = 'Sending...';
  
  try {
    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        access_key: WEB3FORMS_ACCESS_KEY,
        email: email,
        from_name: email,
        subject: `[KD Inquiry] ${subject}`,
        message: message
      })
    });
    
    const result = await response.json();
    
    if (response.status === 200 && result.success) {
      showToast('Inquiry submitted successfully!', false);
      form.reset();
      
      // Close form after successful submission
      setTimeout(() => {
        toggleContactForm(false);
      }, 1500);
    } else {
      showToast(result.message || 'Failed to submit inquiry. Please try again.', true);
    }
  } catch (error) {
    console.error('Error submitting inquiry:', error);
    showToast('A network error occurred. Please try again.', true);
  } finally {
    submitBtn.disabled = false;
    submitBtn.innerHTML = originalBtnText;
  }
}

// Display Toast Notifications
function showToast(message, isError = false) {
  const toast = document.getElementById('toastNotification');
  if (!toast) return;
  
  // Reset classes
  toast.className = 'toast-notification';
  toast.classList.add(isError ? 'error' : 'success');
  
  // Set message content with visual indicators
  toast.innerHTML = isError 
    ? `<span style="font-size: 1.25rem;">✕</span> ${message}` 
    : `<span style="font-size: 1.25rem;">✓</span> ${message}`;
    
  // Trigger animation in
  toast.style.transform = 'translateX(0)';
  
  // Dismiss after 4 seconds
  setTimeout(() => {
    toast.style.transform = 'translateX(180%)';
  }, 4000);
}
