export const sendFile = async (file, context) => {
  console.log(`${typeof file} AND ${context}`);

  // console.log(import.meta.env.VITE_API_URL);
  // return new Promise((resolve) => {
  //   setTimeout(() => {
  //     resolve({
  //       feedback: "With respect, your resume is shit.",
  //     });
  //   }, 300);
  // });
  // //   return { feedback: "With respect, your resume is shit." };

  let formData = new FormData();

  formData.append("resume", file);
  formData.append("context", context);
  const res = await fetch(import.meta.env.VITE_API_URL + "/resume", {
    method: "POST",
    body: formData,
  });

  if (res.ok) {
    return res.json();
  } else {
    return { errorCode: res.status, error: res.statusText };
  }
};

export const sendFileChat = async (file, context, question) => {
  console.log(`${typeof file} AND ${context} AND ${question}`);

  // console.log(import.meta.env.VITE_API_URL);
  // return new Promise((resolve) => {
  //   setTimeout(() => {
  //     resolve({
  //       feedback: "With respect, your resume is shit.",
  //     });
  //   }, 300);
  // });
  // //   return { feedback: "With respect, your resume is shit." };

  let formData = new FormData();

  formData.append("resume", file);
  formData.append("context", context);
  formData.append("question", question);
  const res = await fetch(import.meta.env.VITE_API_URL + "/resumeChat", {
    method: "POST",
    body: formData,
  });

  if (res.ok) {
    return res.json();
  } else {
    return { errorCode: res.status, error: res.statusText };
  }
};
