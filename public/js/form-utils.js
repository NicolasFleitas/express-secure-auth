/**
 * Shared utilities for form handling across the application.
 */
export const FormUtils = {
    /**
     * Updates the UI state of a form during submission.
     * @param {Object} elements - DOM elements (submitBtn, loader, messageDiv)
     * @param {boolean} isLoading - Whether the form is in loading state
     */
    setLoading: (elements, isLoading) => {
        const { submitBtn, loader, messageDiv } = elements;

        if (isLoading) {
            if (messageDiv) messageDiv.style.display = 'none';
            if (loader) loader.style.display = 'inline-block';
            if (submitBtn) submitBtn.disabled = true;
        } else {
            if (loader) loader.style.display = 'none';
            if (submitBtn) submitBtn.disabled = false;
        }
    },

    /**
     * Displays a message in the message container.
     * @param {HTMLElement} messageDiv - The message container element
     * @param {string} text - Message text
     * @param {string} type - 'success' or 'error'
     */
    showMessage: (messageDiv, text, type) => {
        if (!messageDiv) return;
        messageDiv.textContent = text;
        messageDiv.className = `message ${type}`;
        messageDiv.style.display = 'block';
    }
};
