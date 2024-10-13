import './levelswitch.css'
import { useState } from 'react'
import { useEffect } from 'react'

function LevelSwitch(props) {
    const [active, setActive] = useState(1)
    const [style1,setStyle1] = useState({})
    const [style2,setStyle2] = useState({})
    const [style3,setStyle3] = useState({})

    useEffect(()=>{
        switch(active){
            case 1:
                setTimeout(()=>{setStyle1({boxShadow:'0px 0px 30px #a5dfdb'})})
                break
            case 2:
                setTimeout(()=>{setStyle2({boxShadow:'0px 0px 30px #a5dfdb'})})
                break
            case 3:
                setTimeout(()=>{setStyle3({boxShadow:'0px 0px 30px #a5dfdb'})})
                break
            default:
                break
        }
    },[active]) 



    const handleClick = (e) => {
        props.switcher(e.target.value)
        switch(active){
            case 1:
                setTimeout(()=>{setStyle1({})})
                break
            case 2:
                setTimeout(()=>{setStyle2({})})
                break
            case 3:
                setTimeout(()=>{setStyle3({})})
                break
            default:
                break
        }
        setActive(e.target.value)
    }
    

    return (<div className='buttonPos' ><ul className='level-button-group'><li className='button' value={1} style={style1} onClick={handleClick}>Seviye 1</li><li className='button' value={2} style={style2} onClick={handleClick}>Seviye 2</li><li className='button' value={3} style={style3} onClick={handleClick}>Seviye 3</li></ul></div>)
}
export default LevelSwitch