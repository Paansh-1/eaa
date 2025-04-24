document.addEventListener('DOMContentLoaded', () => {

  
  function loginUser() {
  const username = document.querySelector("#username").value;
  const password = document.querySelector("#password").value;

  fetch("http://localhost:3000/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.auth) alert("Login successful!");
      else alert("Login failed.");
    });
}
  // --- Element Selectors ---
    const loginBtn = document.getElementById('login-btn');
    const logoutBtn = document.getElementById('logout-btn');
    const profileLink = document.getElementById('profile-link');
    const reportSubmitSection = document.getElementById('submit-report-section');
    const reportForm = document.getElementById('report-form');

    const loginModal = document.getElementById('login-modal');
    const signupModal = document.getElementById('signup-modal');
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    const closeModalBtns = document.querySelectorAll('.close-btn');
    const showSignupLink = document.getElementById('show-signup');
    const showLoginLink = document.getElementById('show-login');

    // Slider elements
    const slider = document.querySelector('.slider');
    const slides = document.querySelectorAll('.slide');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');

    // Mobile Menu
    const mobileMenuToggle = document.getElementById('mobile-menu');
    const navLinks = document.querySelector('.nav-links');
    const mainNav = document.querySelector('nav');

    // Profile page elements (if on profile page)
    const profileDetailsContainer = document.getElementById('profile-details');
    const orgActions = document.getElementById('org-actions');
    const localActions = document.getElementById('local-actions');

    // --- Authentication Simulation ---
    const USER_STORAGE_KEY = 'gangaMediatorUser';

    function updateAuthState() {
        const user = JSON.parse(localStorage.getItem(USER_STORAGE_KEY));
        const isLoggedIn = !!user; // True if user object exists

        if (isLoggedIn) {
            if (loginBtn) loginBtn.style.display = 'none';
            if (profileLink) profileLink.style.display = 'inline-block';
            if (logoutBtn) logoutBtn.style.display = 'inline-block';
            // Show report section only if logged in and is an organization
            if (reportSubmitSection && user.type === 'org') {
                reportSubmitSection.style.display = 'block';
            } else if (reportSubmitSection) {
                 reportSubmitSection.style.display = 'none';
            }

            // Update profile page if on it
            if (profileDetailsContainer) loadProfileData(user);

        } else {
            if (loginBtn) loginBtn.style.display = 'inline-block';
            if (profileLink) profileLink.style.display = 'none';
            if (logoutBtn) logoutBtn.style.display = 'none';
            if (reportSubmitSection) reportSubmitSection.style.display = 'none';

            // If on profile page and not logged in, redirect or show message
            if (window.location.pathname.includes('profile.html')) {
                 if (profileDetailsContainer) profileDetailsContainer.innerHTML = '<p>Please <a href="index.html">log in</a> to view your profile.</p>';
                 if (orgActions) orgActions.style.display = 'none';
                 if (localActions) localActions.style.display = 'none';
                 // Optionally redirect: window.location.href = 'index.html';
            }
        }
    }

    function loginUser(email, type = 'local', name = 'User') { // Default type and name for demo
        const user = { email: email, type: type, name: name };
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
        updateAuthState();
        closeModal(loginModal);
        closeModal(signupModal);
         // Optional: Redirect to profile or refresh
        // window.location.href = 'profile.html';
        alert(`Welcome, ${name}! You are now logged in.`);
    }

    function logoutUser() {
        localStorage.removeItem(USER_STORAGE_KEY);
        updateAuthState();
        // Redirect to home page after logout
        if (window.location.pathname.includes('profile.html')) {
            window.location.href = 'index.html';
        } else {
             // Optional: just show a message or refresh
             alert('You have been logged out.');
             // location.reload(); // uncomment to refresh page
        }
    }

    // --- Profile Page Logic ---
    function loadProfileData(user) {
        if (!profileDetailsContainer || !user) return;

        profileDetailsContainer.innerHTML = `
            <p><strong>Name:</strong> ${user.name || 'N/A'}</p>
            <p><strong>Email:</strong> ${user.email}</p>
            <p><strong>Account Type:</strong> ${user.type === 'org' ? 'Local Organization/Tester' : 'Local Resident'}</p>
        `;

        // Show relevant action buttons based on type
        if (user.type === 'org' && orgActions && localActions) {
            orgActions.style.display = 'block';
            localActions.style.display = 'none';
        } else if (localActions && orgActions) {
            localActions.style.display = 'block';
            orgActions.style.display = 'none';
        }
    }


    // --- Modal Handling ---
    function openModal(modal) {
        if (modal) modal.style.display = 'block';
    }

    function closeModal(modal) {
        if (modal) modal.style.display = 'none';
    }

    if (loginBtn) {
        loginBtn.addEventListener('click', () => openModal(loginModal));
    }

    closeModalBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            closeModal(loginModal);
            closeModal(signupModal);
        });
    });

    // Close modal if clicking outside the content
    window.addEventListener('click', (event) => {
        if (event.target === loginModal) closeModal(loginModal);
        if (event.target === signupModal) closeModal(signupModal);
    });

    if (showSignupLink) {
        showSignupLink.addEventListener('click', (e) => {
            e.preventDefault();
            closeModal(loginModal);
            openModal(signupModal);
        });
    }
     if (showLoginLink) {
        showLoginLink.addEventListener('click', (e) => {
             e.preventDefault();
             closeModal(signupModal);
             openModal(loginModal);
         });
     }


    // --- Form Submissions (Simulated) ---
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault(); // Prevent actual form submission
            const email = loginForm.email.value;
            // In a real app, you'd verify password here
            // For demo, we assume login is successful & determine type (randomly or based on email?)
             // Simple demo: Assume 'org' if email contains 'org', otherwise 'local'
            const userType = email.includes('org') ? 'org' : 'local';
            const userName = email.split('@')[0]; // Simple name extraction
            loginUser(email, userType, userName);
            loginForm.reset();
        });
    }

    if (signupForm) {
        signupForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = signupForm['signup-email'].value;
            const name = signupForm['signup-name'].value;
            const type = signupForm['signup-type'].value;
            // In a real app, you'd save this to a database
            alert('Sign up successful (Simulated)! Please log in.');
            signupForm.reset();
            closeModal(signupModal);
            openModal(loginModal); // Show login modal after signup
        });
    }

    if (reportForm) {
         reportForm.addEventListener('submit', (e) => {
             e.preventDefault();
             const reportLink = document.getElementById('report-link').value;
             const additionalInfo = document.getElementById('additional-info').value;

             if (reportLink && reportLink.startsWith('http')) {
                 console.log('Report Link Submitted:', reportLink);
                 console.log('Additional Info:', additionalInfo);
                 alert('Thank you! Your report link has been received (Simulated) and will be reviewed.');
                 reportForm.reset();
                 // You could hide the form or show a success message permanently here
             } else {
                 alert('Please enter a valid URL for the report link.');
             }
         });
    }

     // --- Image Slider ---
     let currentSlide = 0;
     const slideCount = slides ? slides.length : 0;

     function showSlide(index) {
         if (!slider || !slides || slideCount === 0) return; // Exit if slider elements don't exist

         if (index >= slideCount) {
             currentSlide = 0;
         } else if (index < 0) {
             currentSlide = slideCount - 1;
         } else {
             currentSlide = index;
         }
         const offset = -currentSlide * 100; // Calculate offset in percentage
         slider.style.transform = `translateX(${offset}%)`;
     }

     if (nextBtn) {
         nextBtn.addEventListener('click', () => {
             showSlide(currentSlide + 1);
         });
     }

     if (prevBtn) {
         prevBtn.addEventListener('click', () => {
             showSlide(currentSlide - 1);
         });
     }

     // Optional: Auto-slide
     // setInterval(() => {
     //    showSlide(currentSlide + 1);
     // }, 5000); // Change slide every 5 seconds

     // Initialize slider
     showSlide(0);


     // --- Mobile Menu Toggle ---
     if (mobileMenuToggle && navLinks && mainNav) {
         mobileMenuToggle.addEventListener('click', () => {
             navLinks.classList.toggle('active');
             mainNav.classList.toggle('mobile-nav-active'); // Add class to nav for potential styling adjustments
         });
     }


    // --- Initial Check ---
    updateAuthState(); // Check login status on page load

});
function loginUser() {
  const username = document.querySelector("#username").value;
  const password = document.querySelector("#password").value;

  fetch("http://localhost:3000/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.auth) alert("Login successful!");
      else alert("Login failed.");
    });
}
 // End DOMContentLoaded