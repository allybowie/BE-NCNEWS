const errRef = {
    '22P02' : {code : 400,
                message : "Invalid input type - Text"},
    '42703': {code: 400,
      message: "Invalid field-name"
    }
  }

  exports.invalidMeth = (req, res, next) => {
    res.status(405).send({msg: `Oak's words echoed, "There's a time and a place for everything, but not now"`})
  }

  exports.invalidPath = (req, res, next)=> {
    res.status(404).send({ msg: "I'm afraid I can go no further"})
  }

  exports.psqlErrors = (err, req, res, next) => {
    if(err.code){
     res.status(errRef[err.code].code).send({msg: errRef[err.code].message})
    } else (next(err))
  }

  exports.normalErrors = (err, req, res, next) => {
    res.status(err.status).send({ msg: err.msg });
  }