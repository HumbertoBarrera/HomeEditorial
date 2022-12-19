import {pool} from "../db.js"



export const getLogin = async (req, res) => {

    const {email, pass} = req.body
    try{
        const [row] = await pool.query('SELECT * FROM cliente WHERE correoElec = ? and password= ?' ,
                                        [email, pass])
        if (row.length <= 0) return res.status(404).json({
            message: 'No se encontró el cliente '
        })
        else{
            res.send('Usuario correcto')
        }
    }catch (error){
        return res.status(500).json({
            message: 'Algo salió mal'

        })
    }
}