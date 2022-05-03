const uploadMedia = (req, input) => {
  let file = null;
  if (req.files[input] !== undefined) {
    file = req.files[input][0].filename
  }
  return file
}

const editMedia = (req, input, editInput) => {
  let file = null;
  if (req.files[input] !== undefined) {
    file = req.files[input][0].filename
  } else {
    if (req.body[editInput]) {
      file = req.body[editInput];
    }
  }
  return file
}

module.exports = {
  uploadMedia,
  editMedia
}
