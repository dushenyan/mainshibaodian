import { JSEncrypt } from 'jsencrypt'

// 密钥对生成 http://web.chacuo.net/netrsakeypair

const publicKey = `
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAtO710f/xv/2yTaksAG8G
ax0OLPxlL2ug6YN6ytgXcF1e8uXFRcQEAw7mgwgpetDupCDBk57QuQgFc9JcjvI+
T7VaTD4rUEeBvUVX6Ln3CP2owjcWrE6taaoAneUzuaYjgdAzWOV4YZDeyH7c1hpD
RvZrDpuj8gmdPlKkgUjfoWcYTDwC5EzVtF5z+dbwshgz9i4+wCkfQXpY/Ok7i0eG
m0fyGnSlAEpphYG3QHyq1dSQAkIDBi3I/NZ8QKcqX150dzPbtYWUAm8yd0x3MdY3
6ts6/l8yZsALzKIRpopXb9s+Rhb6gKCUF7kGd5rOArJh2vO/ComfWB+HH0F/SFmu
gwIDAQAB
`


// 私钥 可能没同步
const privateKey = `
MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC07vXR//G//bJN
qSwAbwZrHQ4s/GUva6Dpg3rK2BdwXV7y5cVFxAQDDuaDCCl60O6kIMGTntC5CAVz
0lyO8j5PtVpMPitQR4G9RVfoufcI/ajCNxasTq1pqgCd5TO5piOB0DNY5XhhkN7I
ftzWGkNG9msOm6PyCZ0+UqSBSN+hZxhMPALkTNW0XnP51vCyGDP2Lj7AKR9Belj8
6TuLR4abR/IadKUASmmFgbdAfKrV1JACQgMGLcj81nxApypfXnR3M9u1hZQCbzJ3
THcx1jfq2zr+XzJmwAvMohGmildv2z5GFvqAoJQXuQZ3ms4CsmHa878KiZ9YH4cf
QX9IWa6DAgMBAAECggEBAJCXKmFAzVvljNkdKWnLT/DHjm2K4f3MYBJcnQN/PvPv
2hH4ZvcC10XuYW4zVpqsXxlQiAHFd/12GI1ffdJKaltejSPCxvBnxJmR0dfMzUsl
Evjp9zeJxHFdhxKnePeSemuiC3auIs6tbCwDnc2HvV33TMSmwpSI9F06w/YBW51q
IOq4YQQcVB/hdlPu0X0x1w+wRCsXgIk+qmegiEri+YR/g1vNAjf/VZYCbK3Be2A5
xmasPHVnKzZ1/MT2q39elnCprrUOGp4oaLzx9/1p9N8rfamzkxqH2MW7Z11Hv/r7
1yb7pWxSokaqaEXDfd5RxpVxUWRz0sJcqGY9yl3v4DkCgYEA8AwwdhGUL+GkhcSO
0R8X5VngQz2Klz4ihvei2hof0oOGFgoGti5/1EINVn4MdOv9/OulXKjEjmdbHnXr
QXaVXP+95Ddhm2HdNtBBtGHvjx2gaEqPzmUSVxblyiCoE+SaOEFx23GJGaAfUURX
3mlYhtez7e8qtdoJp095W6YJXmUCgYEAwPUXQhe/hicV7oOfCPoT+uaWD9P1GtDo
U5S1ihQ0CzMmSNrtpZeVCDGWv0N2Kd7sKW/EJPYazDHeObB1c6LIqZZ1wnlF4YZy
1QuUhS1hMhS5mXP4s0FjoGW6QpowJzCcjQknGfc+KMH2nVdMDIq5EJMR4Au6YWZG
HYD3bYIINscCgYEAy7DcMmPqRdMHo0bOFV94DHL+XLBM+NeNvs9FTiMa26wlTHBH
j7HXYIqH/NvKwDA8frCKyhyfZWMIq8lNzmfMiHSucogX+BzL9KY1CtaLy/pM0hJr
Aq07KdFRPfoGBZNW1eOatKYbuzXnPTNsCFuF9i31DTKEIHma9XD3vrAehQ0CgYAa
yKqO0Q8Txw8jSX/k1hm55RIFZm2KaF8nYugEH6PNvi7dRA5iwvS76246ZFndnAT6
B3qZitPTbkSji1vyTjE+YRU9hmnt0STVb8MQ7Wilc/0DUPa/ox76H8TIA/EVL4k7
hn63+vrU23+o/Xof742awF9l0xru9CxdYg52U+th9wKBgF+ImIAQdJ1h/KxdymzK
pb+K6gwHUXqdGYp7wUOCel0vfLefU3Vc8STTpbtWozIsSHeEfWutLRoa52Mc6Jy0
Pn8lzX1Xz2EiE6Xy+8hhqRJ++ekRR6TzW86mWACmJsMT+InPM7ImnER3YNTRmiyT
9d4pEqcqHWWrGA77HD/u69g0
`

export default {
  // 加密
  encrypt: (txt: string) => {
    const encryptor = new JSEncrypt()
    encryptor.setPublicKey(publicKey) // 设置公钥
    return encryptor.encrypt(txt) // 对数据进行加密
  },

  // 解密
  decrypt: (txt: string) => {
    const encryptor = new JSEncrypt()
    encryptor.setPrivateKey(privateKey) // 设置私钥
    return encryptor.decrypt(txt) // 对数据进行解密
  }
}

