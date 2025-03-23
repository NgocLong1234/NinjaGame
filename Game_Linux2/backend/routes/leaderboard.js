router.post('/update-score', async (req, res) => {
    const {  username, score} = req.body;
    const user = await User.findOneAndUpdate({ username }, { score }, { new: true});

    res.json({ message: 'Diem Da Duoc Cap Nhat!'}, score: user.score});
});

router.get('/leaderboard', async (req, res) => {
    const topPlayer = await User.find().sort({ score: -1}).limit(10);
    res.json(topPlayer);
});

module.exports = router;
