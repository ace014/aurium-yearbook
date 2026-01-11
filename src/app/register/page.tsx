import RegistrationWizard from "@/components/forms/RegistrationWizard";

export default function RegisterPage() {
  return (
    // We removed the padding (py-10) and centering (flex justify-center)
    // Now the wizard can take up the full screen width and height.
    <main className="w-full min-h-screen bg-stone-50">
      <RegistrationWizard />
    </main>
  );
}