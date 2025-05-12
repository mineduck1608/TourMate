  export const apiUrl = 'https://localhost:7147/api'

//export const apiUrl = 'https://tourmate-avbjemhvezgqa4en.southeastasia-01.azurewebsites.net/api'

export const getToken = () => {
  return sessionStorage.getItem('token')
}

export const roleJWT = 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'
