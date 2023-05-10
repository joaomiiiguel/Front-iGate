
// ** MUI Components
import { styled } from '@mui/material/styles'


interface LogoViewProp {
  colorTheme: boolean,
}

//Styled Components

const LogoImg = styled('img')(() => ({
  width: 'auto',
  height: 20
}))

const LogoView = (props: LogoViewProp) => {
  const { colorTheme = true } = props


  console.log('Comp: ');


  return (
    <>
      {colorTheme ? (
        <LogoImg alt='Logo iGateway' src='/images/pages/Logo-blue.png' />
      ) : (
        <LogoImg alt='Logo iGateway' src='/images/pages/Logo-white.png' />
      )}
    </>
  )
}

export default LogoView
