import { useState, type FormEvent } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Eye,
  EyeOff,
  Globe2,
  HeartPulse,
  LockKeyhole,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/shared/components/ui/card";
import { Checkbox } from "@/shared/components/ui/checkbox";
import { Input } from "@/shared/components/ui/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/shared/components/ui/input-otp";
import { Label } from "@/shared/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/shared/components/ui/tabs";
import logo from "../../../assets/icons/logo.png";
import { useLogin } from "../hooks/useLogin";
import type { LoginMethod } from "../types/auth.types";
import { isCashier } from "../access";

function LoginPage() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [method, setMethod] = useState<LoginMethod>("credentials");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [pin, setPin] = useState("");
  const { login, isLoading, error, clearError } = useLogin();

  const submitLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    clearError();
    const form = new FormData(event.currentTarget);
    if (method === "credentials") {
      const user = await login({
        method,
        username: String(form.get("username") ?? "").trim(),
        password: String(form.get("password") ?? ""),
        remember,
      });
      if (user)
        navigate(
          isCashier(user)
            ? "/pos/checkout"
            : "/dashboard",
        );
    } else {
      const user = await login({ method, pin });
      if (user)
        navigate(
          isCashier(user)
            ? "/pos/checkout"
            : "/dashboard",
        );
    }
  };

  return (
    <main className="flex min-h-svh items-center justify-center bg-slate-100 p-4 text-slate-900 sm:p-8 dark:bg-slate-950 dark:text-slate-50">
      <div className="grid min-h-180 w-full min-w-0 max-w-6xl overflow-hidden rounded-3xl border border-white/80 bg-white p-2 shadow-[0_30px_90px_rgba(15,23,42,0.16)] lg:grid-cols-[0.96fr_1.04fr] dark:border-slate-800 dark:bg-slate-900">
        <section className="relative flex min-w-0 max-w-full flex-col overflow-hidden px-4 py-6 sm:px-12 lg:px-16">
          <header className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <img
                className="size-14"
                src={logo}
                alt="Nadir Health Organization"
              />
              <div className="flex flex-col">
                <strong className="text-sm tracking-[0.16em] text-[#07599a] dark:text-sky-300">
                  NADIR
                </strong>
                <span className="text-[8px] font-semibold uppercase tracking-[0.15em] text-[#20b4b8]">
                  Health Organization
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-slate-500">
              <Globe2 className="size-4" aria-hidden="true" />
              <Select
                value={i18n.resolvedLanguage?.split("-")[0] ?? "en"}
                onValueChange={(value) => void i18n.changeLanguage(value)}
              >
                <SelectTrigger
                  className="h-9 w-29.5 border-slate-200 bg-white text-xs shadow-sm dark:border-slate-700 dark:bg-slate-900"
                  aria-label={t("language.label")}
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent
                  className="z-10000 border-slate-200 bg-white text-slate-900 shadow-xl dark:border-slate-700 dark:bg-slate-900 dark:text-slate-50"
                  position="popper"
                >
                  <SelectItem
                    className="cursor-pointer focus:bg-sky-50 focus:text-[#07599a] dark:focus:bg-slate-800"
                    value="en"
                  >
                    {t("language.english")}
                  </SelectItem>
                  <SelectItem
                    className="cursor-pointer focus:bg-sky-50 focus:text-[#07599a] dark:focus:bg-slate-800"
                    value="ar"
                  >
                    {t("language.arabic")}
                  </SelectItem>
                  <SelectItem
                    className="cursor-pointer focus:bg-sky-50 focus:text-[#07599a] dark:focus:bg-slate-800"
                    value="ku"
                  >
                    {t("language.kurdish")}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </header>

          <Card className="mx-auto my-auto w-full min-w-0 max-w-md border-0 bg-transparent shadow-none">
            <CardHeader className="px-0 pb-6 text-center">
              <h1 className="text-3xl font-bold tracking-tight text-slate-950 dark:text-white">
                {t("auth.welcome")}
              </h1>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                {t("auth.subtitle")}
              </p>
            </CardHeader>
            <CardContent className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5 dark:border-slate-700 dark:bg-slate-900">
              <Tabs
                className="min-w-0 max-w-full"
                value={method}
                onValueChange={(value) => {
                  setMethod(value as LoginMethod);
                  clearError();
                }}
              >
                <TabsList className="mb-6 grid h-12 w-full grid-cols-2 gap-1 rounded-xl bg-slate-100 p-1.5 dark:bg-slate-800">
                  <TabsTrigger
                    className="h-full min-w-0 gap-2 rounded-lg px-2 text-xs focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-[#07599a] focus-visible:ring-offset-0 data-[state=active]:bg-white data-[state=active]:text-[#07599a] data-[state=active]:shadow-sm dark:data-[state=active]:bg-slate-700 dark:data-[state=active]:text-sky-300"
                    value="credentials"
                  >
                    <UserRound className="size-4 shrink-0" />
                    <span className="truncate">{t("auth.usernameTab")}</span>
                  </TabsTrigger>
                  <TabsTrigger
                    className="h-full min-w-0 gap-2 rounded-lg px-2 text-xs focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-[#07599a] focus-visible:ring-offset-0 data-[state=active]:bg-white data-[state=active]:text-[#07599a] data-[state=active]:shadow-sm dark:data-[state=active]:bg-slate-700 dark:data-[state=active]:text-sky-300"
                    value="pin"
                  >
                    <LockKeyhole className="size-4 shrink-0" />
                    <span className="truncate">{t("auth.pinTab")}</span>
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="credentials" className="mt-0">
                  <form className="min-w-0 space-y-4" onSubmit={submitLogin}>
                    <div className="space-y-2">
                      <Label
                        htmlFor="username"
                        className="text-xs font-semibold"
                      >
                        {t("auth.username")}
                      </Label>
                      <div className="relative">
                        <UserRound className="absolute inset-s-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                        <Input
                          id="username"
                          name="username"
                          className="h-11 ps-10 text-sm focus-visible:ring-[#20b4b8]"
                          autoComplete="username"
                          placeholder={t("auth.usernamePlaceholder")}
                          required
                          autoFocus
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="password"
                        className="text-xs font-semibold"
                      >
                        {t("auth.password")}
                      </Label>
                      <div className="relative">
                        <LockKeyhole className="absolute inset-s-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                        <Input
                          id="password"
                          name="password"
                          className="h-11 px-10 text-sm focus-visible:ring-[#20b4b8]"
                          type={showPassword ? "text" : "password"}
                          autoComplete="current-password"
                          placeholder={t("auth.passwordPlaceholder")}
                          required
                        />
                        <Button
                          className="absolute inset-e-1 top-1/2 size-9 -translate-y-1/2 text-slate-400 hover:text-[#07599a]"
                          variant="ghost"
                          size="icon"
                          type="button"
                          aria-label={
                            showPassword
                              ? t("auth.hidePassword")
                              : t("auth.showPassword")
                          }
                          onClick={() => setShowPassword((value) => !value)}
                        >
                          {showPassword ? (
                            <EyeOff className="size-4" />
                          ) : (
                            <Eye className="size-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <Checkbox
                          id="remember"
                          checked={remember}
                          onCheckedChange={(value) =>
                            setRemember(value === true)
                          }
                          className="border-slate-300 data-[state=checked]:border-[#07599a] data-[state=checked]:bg-[#07599a]"
                        />
                        <Label
                          htmlFor="remember"
                          className="cursor-pointer text-xs font-normal text-slate-500"
                        >
                          {t("auth.remember")}
                        </Label>
                      </div>
                      <Button
                        type="button"
                        variant="link"
                        className="h-auto p-0 text-xs text-[#07599a]"
                      >
                        {t("auth.forgotPassword")}
                      </Button>
                    </div>
                    {error && (
                      <p
                        className="rounded-lg border border-red-200 bg-red-50 p-2.5 text-xs text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300"
                        role="alert"
                      >
                        {error}
                      </p>
                    )}
                    <Button
                      className="h-11 w-full gap-2 bg-linear-to-r from-[#07599a] to-[#168c90] text-xs font-semibold text-white shadow-lg shadow-sky-900/15 hover:opacity-90"
                      disabled={isLoading}
                    >
                      {isLoading ? t("auth.signingIn") : t("auth.signIn")}
                      <ArrowRight className="size-4 rtl:rotate-180" />
                    </Button>
                  </form>
                </TabsContent>

                <TabsContent value="pin" className="mt-0">
                  <form className="min-w-0 space-y-5" onSubmit={submitLogin}>
                    <div className="flex gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800">
                      <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-teal-50 text-[#168c90] dark:bg-teal-950">
                        <LockKeyhole className="size-5" />
                      </span>
                      <span className="flex flex-col">
                        <strong className="text-xs">
                          {t("auth.pinTitle")}
                        </strong>
                        <small className="mt-1 text-[11px] text-slate-500">
                          {t("auth.pinDescription")}
                        </small>
                      </span>
                    </div>
                    <InputOTP
                      maxLength={6}
                      value={pin}
                      onChange={setPin}
                      inputMode="numeric"
                      pattern="[0-9]*"
                      aria-label={t("auth.pinLegend")}
                      autoFocus
                      containerClassName="justify-center"
                    >
                      <InputOTPGroup className="gap-2">
                        {Array.from({ length: 6 }, (_, index) => (
                          <InputOTPSlot
                            className="size-11 rounded-lg border text-lg font-bold text-[#07599a] first:rounded-lg first:border last:rounded-lg focus-within:border-[#20b4b8]"
                            key={index}
                            index={index}
                            aria-label={t("auth.pinDigit", {
                              number: index + 1,
                            })}
                          />
                        ))}
                      </InputOTPGroup>
                    </InputOTP>
                    {error && (
                      <p
                        className="rounded-lg border border-red-200 bg-red-50 p-2.5 text-xs text-red-700"
                        role="alert"
                      >
                        {error}
                      </p>
                    )}
                    <Button
                      className="h-11 w-full gap-2 bg-linear-to-r from-[#07599a] to-[#168c90] text-xs font-semibold text-white hover:opacity-90"
                      disabled={pin.length !== 6 || isLoading}
                    >
                      {isLoading ? t("auth.verifying") : t("auth.continue")}
                      <ArrowRight className="size-4 rtl:rotate-180" />
                    </Button>
                    <Button
                      type="button"
                      variant="link"
                      className="mx-auto flex h-auto p-0 text-xs text-[#07599a]"
                    >
                      {t("auth.pinHelp")}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
            </CardContent>
            <CardFooter className="mt-8 justify-between px-1 pb-0 text-[10px] text-slate-400">
              <span>{t("footer.copyright")}</span>
              <span>{t("footer.privacy")}</span>
            </CardFooter>
          </Card>
        </section>

        <aside className="relative hidden overflow-hidden rounded-[22px] bg-linear-to-br from-[#06487d] via-[#07599a] to-[#168c90] p-14 text-white lg:flex lg:flex-col">
          <div className="absolute -inset-e-28 -top-28 size-80 rounded-full border border-white/10" />
          <div className="absolute -bottom-44 -inset-32 size-96 rounded-full bg-[#20b4b8]/20" />
          <div className="relative z-10 mt-12">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-teal-200">
              {t("brand.system")}
            </p>
            <h2 className="mt-4 max-w-md text-5xl font-semibold leading-[1.05] tracking-tight text-white">
              {t("brand.headlineLine1")}
              <br />
              {t("brand.headlineLine2")}
            </h2>
            <p className="mt-5 max-w-md text-sm leading-7 text-white/65">
              {t("brand.description")}
            </p>
          </div>
          <div className="relative z-10 my-auto flex items-center justify-center">
            <div className="absolute size-80 rounded-full border border-dashed border-white/20" />
            <div className="grid size-44 place-items-center overflow-hidden rounded-[38px] border border-white/60 bg-white shadow-2xl">
              <img className="size-40 max-w-none" src={logo} alt="" />
            </div>
            <div className="absolute inset-s-0 top-4 flex items-center gap-2 rounded-xl border border-white/50 bg-white/95 p-3 text-slate-800 shadow-xl">
              <HeartPulse className="size-5 text-[#20b4b8]" />
              <span className="flex flex-col">
                <small className="text-[9px] text-slate-500">
                  {t("brand.clinicalCare")}
                </small>
                <strong className="text-xs">{t("brand.connected")}</strong>
              </span>
            </div>
            <div className="absolute inset-e-0 bottom-4 flex items-center gap-2 rounded-xl border border-white/50 bg-white/95 p-3 text-slate-800 shadow-xl">
              <ShieldCheck className="size-5 text-[#07599a]" />
              <span className="flex flex-col">
                <small className="text-[9px] text-slate-500">
                  {t("brand.systemStatus")}
                </small>
                <strong className="text-xs">{t("brand.secure")}</strong>
              </span>
            </div>
          </div>
          <div className="relative z-10 flex items-center gap-3 border-t border-white/15 pt-6">
            <ShieldCheck className="size-6 text-teal-200" />
            <span className="flex flex-col">
              <strong className="text-xs">{t("brand.protected")}</strong>
              <small className="mt-1 text-[10px] text-white/55">
                {t("brand.encrypted")}
              </small>
            </span>
          </div>
        </aside>
      </div>
    </main>
  );
}

export default LoginPage;
