import UsuarioTable from "../componentes/tables/UsuarioTable"
import CreateUsuario from "../componentes/modal/CreateUsuario"
import { useState } from "react"

export const Usuario = () => {

    const [open, setOpen] = useState(false)

    const handleToggle = () => {
        setOpen(true)
    }

    return (
        <div className="p-4">
            <div className="flex justify-end mb-2">
                <button type="button" onClick={handleToggle} className="p-2 bg-gray-500 cursor-pointer  hover:bg-gray-700 text-white rounded-lg">
                    Agregar
                </button>
            </div>
            <UsuarioTable/>

            {open &&  <CreateUsuario Close={() => setOpen(false)}/>}   
        </div>
    )
}

export default Usuario