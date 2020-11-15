const {Router} = require('express')
const bcrypt = require('bcrypt')
const {check, validationResult} = require('express-validator')
const jwt = require('jsonwebtoken')
const config = require('config')
const router = Router()

// https://www.youtube.com/watch?v=ivDjWYcKDZI&ab_channel=%D0%92%D0%BB%D0%B0%D0%B4%D0%B8%D0%BB%D0%B5%D0%BD%D0%9C%D0%B8%D0%BD%D0%B8%D0%BD

// /api/auth/register
router.post(
    '/register',
    [
        check('email', 'Некорректный email').isEmail(),
        check('password', 'Минимальная длина пароля 6 символов')
            .isLength({min: 6})
    ],
    async (req, res) => {
    try {
        const errors = validationResult(req)

        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array(),
                message: 'Некорректные данные'
            })
        }

        const {email, password} = req.body

        const hashedPassword = await bcrypt.hash(password, 12)

    } catch (e) {
        res.status(500).json({message: 'Что-то пошло не так, попробуйте снова'})
    }
})

// /api/auth/login
router.post(
    '/login',
    [
        check('email', 'Некорректный email').normalizeEmail().isEmail(),
        check('password', 'Минимальная длина пароля 6 символов').exists()
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req)

            console.log(req.body)

            if (!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array(),
                    message: 'Некорректные данные'
                })
            }

            //const {email, password} = req.body

            //DEV DEPENDENCIES
            const email = 'test@test.ru'
            const password = 'test'

            const isMatch = await bcrypt.compare(password, "$2b$12$.8wSHMmB1kS3OBZ4Xy1hQuZYeuTggGAeafEfQSlQfwPflHn49bTW2")

            if (!isMatch) {
                return res.status(400).json({message: "Неверный логин или пароль"})
            }

            const token = jwt.sign(
                {userId: 'переменная с id пользователя'},
                config.get('jwtSecret'),
                { expiresIn: '1hr'}
            )

            res.json({token, userId: '12345'})

        } catch (e) {
            res.status(500).json({message: 'Что-то пошло не так, попробуйте снова'})
        }
})

module.exports = router