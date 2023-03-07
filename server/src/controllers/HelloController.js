
class HelloController{
    async index(req, res){
        return res.json({hello: "opa"})
    }
}

export default new HelloController()