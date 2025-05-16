export const sendFile = async (file, context) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        feedback: "With respect, your resume is shit.",
      });
    }, 300);
  });
  //   return { feedback: "With respect, your resume is shit." };
};
