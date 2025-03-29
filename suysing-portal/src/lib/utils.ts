
// Function to check if user is authenticated
export const isAuthenticated = () => {
  if (typeof window === 'undefined') return false;
  
  const auth = localStorage.getItem('auth');
  if (!auth) return false;
  
  try {
    const authData = JSON.parse(auth);
    return !!authData.token;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (_error) {
    // Ignore JSON parse error and return false
    return false;
  }
};

// Function to get user data
export const getUser = () => {
  if (typeof window === 'undefined') return null;
  
  const auth = localStorage.getItem('auth');
  if (!auth) return null;
  
  try {
    const authData = JSON.parse(auth);
    return authData.user;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (_error) {
    // Ignore JSON parse error and return null
    return null;
  }
};

// Function to get pagination range
export const getPaginationRange = (totalPages: number, currentPage: number, maxPages: number = 5) => {
  if (totalPages <= maxPages) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const leftSiblingIndex = Math.max(currentPage - 1, 1);
  const rightSiblingIndex = Math.min(currentPage + 1, totalPages);

  const shouldShowLeftDots = leftSiblingIndex > 2;
  const shouldShowRightDots = rightSiblingIndex < totalPages - 2;

  if (!shouldShowLeftDots && shouldShowRightDots) {
    const leftItemCount = 3 + 2;
    return Array.from({ length: leftItemCount }, (_, i) => i + 1);
  }

  if (shouldShowLeftDots && !shouldShowRightDots) {
    const rightItemCount = 3 + 2;
    return Array.from(
      { length: rightItemCount },
      (_, i) => totalPages - rightItemCount + i + 1
    );
  }

  if (shouldShowLeftDots && shouldShowRightDots) {
    return [1, leftSiblingIndex, currentPage, rightSiblingIndex, totalPages];
  }

  return Array.from({ length: totalPages }, (_, i) => i + 1);
};

// Function to format date
export const formatDate = (date: Date | string) => {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });
};

// Function to format time
export const formatTime = (date: Date | string) => {
  const d = new Date(date);
  return d.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
};



// Function to check the response if token is invalid or expired and clear the auth in localStorage
export const validateTokenResponse = (error : any) => {

  if(error?.status == 401){
    if(error?.response?.data?.code == "token_not_valid"){
      if (typeof window !== 'undefined') {
        // remove local storage auth and force reload
        localStorage.removeItem('auth');
        window.location.assign(window.location.origin + window.location.pathname);
      }
    }
  }

  return;
};
