"use client"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Car } from "lucide-react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { loginWithNextAuth } from "./nextAuthHelper"
import { LoginFormPresentation } from "./LoginFormPresentation"
import type { LoginForm } from "../types"
import { redirectIfStatus200 } from "./helper"
import { VALIDATION_MESSAGES, ROUTES } from "../constants"

// Zod schema for login form
const loginSchema = z.object({
  username: z.string().min(2, { message: VALIDATION_MESSAGES.USERNAME_MIN }),
  password: z.string().min(6, { message: VALIDATION_MESSAGES.PASSWORD_MIN })
})

export default function LoginPage() {
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema)
  })

  const onSubmit = async (data: LoginForm) => {
    if (!data.username || !data.password) return
    const responseLogin = await loginWithNextAuth(data.username, data.password)
    if (responseLogin?.error) {
      alert("Error de inicio de sesión: " + responseLogin.error)
      return
    }
    if (responseLogin && !responseLogin.error) {
      redirectIfStatus200(responseLogin.status, router, ROUTES.DASHBOARD)
    }
  }

  return (
    <div className="login-container">
      {/* Left side */}
      <div className="login-left">
        <div className="login-left-content">
          {/* Puedes dejar vacío o agregar algo si lo deseas */}
        </div>
      </div>
      {/* Right side */}
      <div className="login-right">
        <div className="login-form-container">
          <div className="login-title">
            <Car className="w-12 h-12 mx-auto mb-2" />
            <h1>Inicio de Sesión</h1>
          </div>

          <LoginFormPresentation
            onSubmit={handleSubmit(onSubmit)}
            errors={errors}
            register={register}
            isLoading={isSubmitting}
          />
          <div className="login-recover-container">
            <span>No tienes una cuenta?</span>
            <Link href={ROUTES.REGISTER} className="login-recover-link">
              Registrate aquí
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
