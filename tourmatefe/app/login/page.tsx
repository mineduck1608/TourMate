import { LoginForm } from "./login-form";

export default function LoginPage() {
  return (
    <div className="gradient-bg glowing-effect flex min-h-svh flex-col items-center justify-center p-6 md:p-10 relative overflow-hidden">
      <img
        src="/danang.jpg"
        alt="Image"
        className="absolute inset-0 h-full w-full object-cover blur-[2px] dark:brightness-[0.2] dark:grayscale"
      />
      <div className="w-full max-w-sm md:max-w-3xl relative z-10">
        <LoginForm />
      </div>
    </div>
  );
}
