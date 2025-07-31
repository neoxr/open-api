export default (req, res) => {
   res.json({
      creator: global.creator,
      status: false,
      msg: 'Feature is currently unavailable'
   })
}