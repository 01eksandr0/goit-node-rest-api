export const createConfigSendgrid = (email, verificationToken) => ({
  to: email,
  subject: "Verify email",
  html: `<a target="_blank" href="${process.env.BASE_URL}/api/users/verify/${verificationToken}">Click verify email</a>`,
});
