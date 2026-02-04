// export const mapAdminPayload = (formData) => {
//   return {
//     firstName:formData.firstName,
//     lastName: formData.lastName,
//     email: formData.email,
//     password: formData.password,
//     cafeName: formData.cafeName,
//     phoneNumber: Number(formData.phoneNumber),
//     address: formData.address,
//     city: formData.city,
//     state: formData.state,
//     pincode: String(formData.pincode),
//     logo: formData.logo,          // backend required
//     profileImage: formData.profileImage,
//         // backend required
//          // backend required
//   };
// };



export const mapAdminPayload = (data) => {
  const formData = new FormData();

  formData.append("firstName", data.firstName);
  formData.append("lastName", data.lastName);
  formData.append("email", data.email);
  formData.append("password", data.password);
  formData.append("cafeName", data.cafeName);
  formData.append("phoneNumber", data.phoneNumber);
  formData.append("address", data.address);
  formData.append("state", data.state);
  formData.append("city", data.city);
  formData.append("pincode", data.pincode);
  formData.append("selectedLayout", data.selectedLayout);
  if (data.logo) {
    formData.append("logo", data.logo);
  }

  if (data.profileImage) {
    formData.append("profileImage", data.profileImage);
  }

  return formData;
};

