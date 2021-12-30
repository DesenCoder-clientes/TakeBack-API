export function CPFValidate(userCPF: string): boolean {
  let soma = 0

  soma += parseInt(userCPF[0]) * 10
  soma += parseInt(userCPF[1]) * 9
  soma += parseInt(userCPF[2]) * 8
  soma += parseInt(userCPF[3]) * 7
  soma += parseInt(userCPF[4]) * 6
  soma += parseInt(userCPF[5]) * 5
  soma += parseInt(userCPF[6]) * 4
  soma += parseInt(userCPF[7]) * 3
  soma += parseInt(userCPF[8]) * 2
  soma = (soma * 10) % 11

  if (soma !== parseInt(userCPF[9])) {
    return false
  }

  soma = 0

  soma += parseInt(userCPF[0]) * 11
  soma += parseInt(userCPF[1]) * 10
  soma += parseInt(userCPF[2]) * 9
  soma += parseInt(userCPF[3]) * 8
  soma += parseInt(userCPF[4]) * 7
  soma += parseInt(userCPF[5]) * 6
  soma += parseInt(userCPF[6]) * 5
  soma += parseInt(userCPF[7]) * 4
  soma += parseInt(userCPF[8]) * 3
  soma += parseInt(userCPF[9]) * 2
  soma = (soma * 10) % 11

  if (soma !== parseInt(userCPF[10])) {
    return false
  }

  return true
}
