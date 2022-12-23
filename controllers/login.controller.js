class LoginController {

  login = async (req, res, next) => {
    try {
      let email = req.body.email;
      let password = req.body.password;
    } catch (err) {

    }
  }
}

module.exports = LoginController