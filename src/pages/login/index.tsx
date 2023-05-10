// ** React Imports
import { ReactNode /*, useEffect*/, useState } from 'react'

// ** Next Imports
import { useRouter } from 'next/router'

// ** MUI Components
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import CardContent from '@mui/material/CardContent'
import { styled } from '@mui/material/styles'
import MuiCard, { CardProps } from '@mui/material/Card'

// ** Layout Import
import BlankLayout from 'src/@core/layouts/BlankLayout'

// ** Demo Imports
import { LoginBgIllustration } from 'src/views/pages/auth/LoginIllustration'

import { cnpj, cpf } from 'magic-masks'
import { validateBr } from 'js-brasil'

import { login } from 'src/back/iGateway'
import { useSettings } from 'src/@core/hooks/useSettings'
import Snackbar from '@mui/material/Snackbar'
import MuiAlert, { AlertProps } from '@mui/material/Alert'
import React from 'react'
import LogoView from 'src/views/logo-view'

interface LoginProps {
  acessKey: string
  cnpjCpf: string
}

// ** Styled Components
const Card = styled(MuiCard)<CardProps>(({ theme }) => ({
  [theme.breakpoints.up('sm')]: { width: '28rem' },
  backgroundColor: theme.palette.primary.main,
  padding: theme.spacing(7, 9, 5),
  boxShadow: '0px 2.77154px 17.3221px rgba(0, 0, 0, 0.25)',
  borderRadius: '30px'
}))

const CardContentLogin = styled('div')(({ theme }) => ({
  backgroundColor: theme.palette.common.white,
  borderRadius: 18,
  padding: '32px 20px'
}))

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant='filled' {...props} />
})

const WelcomeText = styled('p')(() => ({
  fontSize: 16,
  fontWeight: 400,
  margin: 0
}))
const TitleWelcomeText = styled('p')(() => ({
  fontSize: 22,
  fontWeight: 700,
  margin: 0
}))
const CaptionWelcomeText = styled('p')(() => ({
  fontSize: 12,
  fontWeight: 400,
  marginTop: 0
}))

const LoginPage = () => {
  // ** Hook
  const router = useRouter()
  const [formStateLogin, setFormStateLogin] = useState<LoginProps>({
    acessKey: '',
    cnpjCpf: ''
  })

  const [openErroLogin, setOpenErroLogin] = useState(false)
  const [openErroIPT, setOpenErroIPT] = useState(false)
  const [openErroLoginGenerico, setOpenErroLoginGenerico] = useState(false)

  const { infoIgateway, igatewayPort, reloadInfoIgateway } = useSettings()

  // const { statusIgateway } = infoIgateway

  //  useEffect(()=>{
  //    if (['RUN','STOP'].includes(statusIgateway as string)) router.push('/dashboard')
  //    if (statusIgateway=='ERRO') router.push('/errorIgateway')
  //  },[statusIgateway])

  const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return
    }
    setOpenErroLogin(false)
    setOpenErroIPT(false)
    setOpenErroLoginGenerico(false)
  }

  async function acessar() {
    const cnpjCpfSemPontos = formStateLogin.cnpjCpf.replace(/[/.-]/g, '')
    const loginResult = await login(formStateLogin.acessKey, cnpjCpfSemPontos, igatewayPort as string)

    switch (loginResult) {
      case 'ERROLOGIN':
        setOpenErroLogin(true)
        break
      case 'ERROIPT':
        setOpenErroIPT(true)
        break
      case 'ERROIGATEWAY':
        router.push('/errorIgateway')
        break
      default:
        if (loginResult.startsWith('db_')) {
          await reloadInfoIgateway()
          router.push('/dashboard')
        } else {
          setOpenErroLoginGenerico(true)
        }
    }
  }

  return infoIgateway ? (
    <Box className='content-center'>
      <Card sx={{ zIndex: 1 }}>
        <CardContent>
          <Box sx={{ mb: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <LogoView colorTheme={false} />
          </Box>
          <CardContentLogin>
            <Box sx={{ mb: 6 }}>
              <WelcomeText>Bem vindo ao</WelcomeText>
              <TitleWelcomeText>iGateway Inspell</TitleWelcomeText>
              <CaptionWelcomeText>Por favor, informe os dados para acesso</CaptionWelcomeText>
            </Box>
            <TextField
              autoFocus
              fullWidth
              id='acessKey'
              label='Chave de Acesso'
              sx={{ marginBottom: 4 }}
              value={formStateLogin.acessKey}
              onChange={e => {
                setFormStateLogin({ ...formStateLogin, acessKey: e.currentTarget.value || '' })
              }}
            />
            <TextField
              fullWidth
              id='cnpjCpf'
              label='CNPJ/CPF'
              sx={{ marginBottom: 4 }}
              value={formStateLogin.cnpjCpf}
              onChange={e => {
                const formattedValue = e.target.value.replaceAll('.', '').replaceAll('/', '')

                const isCpfValid = validateBr.cpf(cpf(formattedValue))
                const updatedValue = isCpfValid ? cpf(formattedValue) : cnpj(formattedValue)

                setFormStateLogin({ ...formStateLogin, cnpjCpf: updatedValue || '' })
              }}
              onKeyUp={e => {
                if (e.key == 'Enter') acessar()
              }}
            />
            <Button
              fullWidth
              size='large'
              variant='contained'
              sx={{ mb: 4, mt: 2 }}
              onClick={acessar}
              disabled={
                formStateLogin.acessKey.length < 5 ||
                (!validateBr.cpf(formStateLogin.cnpjCpf) && !validateBr.cnpj(formStateLogin.cnpjCpf))
              }
            >
              Acessar
            </Button>
          </CardContentLogin>
        </CardContent>
      </Card>
      <LoginBgIllustration />

      <Snackbar open={openErroLogin} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity='warning' sx={{ width: '100%' }}>
          Chave de acesso ou CNPJ/CPF inválidos!
        </Alert>
      </Snackbar>
      <Snackbar open={openErroLoginGenerico} autoHideDuration={10000} onClose={handleClose}>
        <Alert onClose={handleClose} severity='error' sx={{ width: '100%' }}>
          Erro no processo de Login!
        </Alert>
      </Snackbar>
      <Snackbar open={openErroIPT} autoHideDuration={10000} onClose={handleClose}>
        <Alert onClose={handleClose} severity='error' sx={{ width: '100%' }}>
          Erro ao acessar servidor do iPonto!
        </Alert>
      </Snackbar>
    </Box>
  ) : (
    <></>
  )
}

LoginPage.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>

export default LoginPage
