//To stop the loading screen
window.addEventListener('load', () => {
    const loaderWrapper = document.querySelector('.loader-wrapper');
    loaderWrapper.classList.add('fade-out');
    
    // Optional: remove the loader from DOM after fade animation
    setTimeout(() => {
        loaderWrapper.style.display = 'none';
    }, 500); // 500ms matches the transition duration in CSS
});
