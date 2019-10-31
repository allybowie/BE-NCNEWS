exports.errRef = {
    '22P02' : {code : 400,
                message : "Invalid input type - Text"},
    '42703': {code: 400,
      message: "Invalid field-name"
    }
  }

  exports.invalidMeth = (req, res, next) => {
    res.status(405).send({msg: `Oak's words echoed, "There's a time and a place for everything, but not now"`})
  }