"use client"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Car } from "lucide-react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { VALIDATION_MESSAGES, ROUTES } from "../../constants"
import { registerUser } from "../../services/authService"
import { useState } from "react"

// Zod schema for register form
const registerSchema = z.object({
  username: z.string().min(2, { message: VALIDATION_MESSAGES.USERNAME_MIN }),
  email: z.string().email({ message: VALIDATION_MESSAGES.EMAIL_INVALID }),
  password: z.string().min(6, { message: VALIDATION_MESSAGES.PASSWORD_MIN }),
  confirmPassword: z.string().min(6, { message: VALIDATION_MESSAGES.CONFIRM_PASSWORD })
}).refine((data) => data.password === data.confirmPassword, {
  message: VALIDATION_MESSAGES.PASSWORDS_NOT_MATCH,
  path: ["confirmPassword"],
})

type RegisterForm = z.infer<typeof registerSchema>

export default function RegisterPage() {
  const router = useRouter()
  const [error, setError] = useState<string>("")

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema)
  })

  const onSubmit = async (data: RegisterForm) => {
    try {
      setError("") // Limpiar errores previos

      if (!data.email || !data.password || !data.username) return

      // Crear el objeto de registro en el formato requerido
      const registerData = {
        username: data.username,
        password: data.password,
        email: data.email
      }

      console.log("Datos de registro:", registerData)

      // Llamar al servicio de registro
      const response = await registerUser(registerData)

      console.log("Registro exitoso:", response)
      alert(`¡${response.message}! Redirigiendo al login...`)
      router.push("/")

    } catch (error) {
      console.error("Error en registro:", error)
      const errorMessage = error instanceof Error ? error.message : "Error desconocido en el registro"
      setError(errorMessage)
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
            <h1>Registro</h1>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="login-form">
            {error && (
              <div className="error-message mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                {error}
              </div>
            )}

            <div className="form-group">
              <label htmlFor="username" className="form-label">Nombre de Usuario</label>
              <input
                id="username"
                type="text"
                {...register("username")}
                className={`form-input ${errors.username ? 'error' : ''}`}
                placeholder="Ingresa tu nombre de usuario"
              />
              {errors.username && (
                <span className="error-message">{errors.username.message}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="email" className="form-label">Email</label>
              <input
                id="email"
                type="email"
                {...register("email")}
                className={`form-input ${errors.email ? 'error' : ''}`}
                placeholder="Ingresa tu email"
              />
              {errors.email && (
                <span className="error-message">{errors.email.message}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">Contraseña</label>
              <input
                id="password"
                type="password"
                {...register("password")}
                className={`form-input ${errors.password ? 'error' : ''}`}
                placeholder="Ingresa tu contraseña"
              />
              {errors.password && (
                <span className="error-message">{errors.password.message}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword" className="form-label">Confirmar Contraseña</label>
              <input
                id="confirmPassword"
                type="password"
                {...register("confirmPassword")}
                className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
                placeholder="Confirma tu contraseña"
              />
              {errors.confirmPassword && (
                <span className="error-message">{errors.confirmPassword.message}</span>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="login-submit-btn"
            >
              {isSubmitting ? "Registrando..." : "Registrarse"}
            </button>
          </form>

          <div className="login-recover-container">
            <span>¿Ya tienes cuenta?</span>
            <Link href={ROUTES.LOGIN} className="login-recover-link">
              Iniciar Sesión
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
