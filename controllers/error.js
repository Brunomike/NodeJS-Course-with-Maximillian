exports.get404 = (req, res, next) => {
  res.render("404", { pageTitle: "Page Not Found!", path: "/404" });
};

exports.get500 = (req, res, next) => {
  res.render("500", { pageTitle: "Error!", path: "/500" });
};
