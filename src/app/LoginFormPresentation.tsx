import { FieldErrors, UseFormRegister } from "react-hook-form";
import { LoginForm } from "../types";

interface LoginFormPresentationProps {
  onSubmit: () => void;
  errors: FieldErrors<LoginForm>;
  register: UseFormRegister<LoginForm>;
  isLoading: boolean;
}

export function LoginFormPresentation({
  onSubmit,
  errors,
  register,
  isLoading
}: LoginFormPresentationProps) {
  return (
    <form onSubmit={onSubmit} className="login-form">
      <div className="form-group">
        <label htmlFor="username">Nombre de Usuario</label>
        <input
          type="text"
          id="username"
          {...register("username")}
          className={`form-input ${errors.username ? 'error' : ''}`}
          placeholder="Ingresa tu nombre de usuario"
        />
        {errors.username && (
          <span className="error-message">{errors.username.message}</span>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="password">Contraseña</label>
        <input
          type="password"
          id="password"
          {...register("password")}
          className={`form-input ${errors.password ? 'error' : ''}`}
          placeholder="Ingresa tu contraseña"
        />
        {errors.password && (
          <span className="error-message">{errors.password.message}</span>
        )}
      </div>

      <button
        type="submit"
        className="login-button"
        disabled={isLoading}
      >
        {isLoading ? 'Iniciando sesión...' : 'Iniciar sesión'}
      </button>
    </form>
  );
}
