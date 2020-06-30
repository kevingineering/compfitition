module.exports = (req, res, next) => {
  try {
    const { adminPassword } = req.body
    //validate password from environment variables
    if (adminPassword !== process.env.adminPassword)
      return res.status(422).json({ msg: 'Password is incorrect.' })

    next()
  } catch (err) {
    res.status(500).json({ msg: 'Server error.' })
  }
}
