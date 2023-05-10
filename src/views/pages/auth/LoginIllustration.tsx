import { styled } from '@mui/material/styles'

// Styled Components
const MaskBgImg = styled('img')(() => ({
  top: 0,
  zIndex: -1,
  width: '100%',
  height: '100vh',
  backgroundColor: '#2F4361',
  position: 'absolute'
}))

const BoxFooter = styled('div')(() => ({
  bottom: 0,
  position: 'absolute',
  height: '40vh',
  width: '100%',
  backgroundColor: '#FFF'
}))

const TextCopyrightFooter = styled('p')(() => ({
  bottom: 5,
  position: 'absolute',
  fontStyle: 'normal',
  fontWeight: 500,
  fontSize: '14px',
  lineHeight: '17px'
}))

export const LoginBgIllustration = () => {
  return (
    <>
      <MaskBgImg alt='background mask' src={`/images/pages/backgroundLogin.png`} />
      <BoxFooter />
      <TextCopyrightFooter>Copyright © Inspell Softwares 2023</TextCopyrightFooter>
    </>
  )
}
