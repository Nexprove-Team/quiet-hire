import {
  Container,
  Heading,
  Hr,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import EmailContainer from "../components/container";

interface VerificationOTPEmailProps {
  otp: string;
  type: "sign-in" | "email-verification" | "forget-password";
}

const typeConfig = {
  "email-verification": {
    subject: "Verify your email",
    preview: "Your HackHyre verification code is inside",
    heading: "Verify your email",
    body: "Use the code below to verify your email address and activate your HackHyre account.",
  },
  "sign-in": {
    subject: "Your sign-in code",
    preview: "Your HackHyre sign-in code is inside",
    heading: "Sign in to HackHyre",
    body: "Use the code below to sign in to your HackHyre account.",
  },
  "forget-password": {
    subject: "Reset your password",
    preview: "Your HackHyre password reset code is inside",
    heading: "Reset your password",
    body: "Use the code below to reset your HackHyre account password.",
  },
};

export default function VerificationOTPEmail({
  otp,
  type,
}: VerificationOTPEmailProps) {
  const config = typeConfig[type];

  return (
    <EmailContainer preview={<Preview>{config.preview}</Preview>}>
      <Container className="mx-auto my-0 max-w-150 rounded-lg border-solid border-gray-200 bg-white px-10 py-8">
        <Section className="mt-4 mb-8">
          <Text className="font-display m-0 text-7 font-bold tracking-tight text-brand-black">
            Hack<span className="text-brand-green">Hyre</span>
          </Text>
        </Section>

        <Heading className="font-display m-0 mb-4 text-7 font-bold text-brand-black">
          {config.heading}
        </Heading>

        <Text className="m-0 mb-6 text-4 leading-6 text-gray-600">
          {config.body}
        </Text>
        <Section className="mb-6 rounded-lg bg-gray-50 px-0 py-8 text-center">
          <Text className="font-display m-0 text-12 font-bold tracking-widest text-brand-black">
            {otp}
          </Text>
        </Section>
        <Text className="m-0 mb-6 text-3.5 leading-5 text-gray-500">
          This code expires in <strong>10 minutes</strong>. If you didn't
          request this code, you can safely ignore this email.
        </Text>
        <Hr className="my-6 border-solid border-gray-200" />
        <Text className="m-0 text-3 leading-4 text-gray-400">
          &copy; {new Date().getFullYear()} HackHyre. All rights reserved.
        </Text>
        <Text className="m-0 mt-1 text-3 leading-4 text-gray-400">
          You're receiving this because you signed up for a HackHyre account.
        </Text>
      </Container>
    </EmailContainer>
  );
}

VerificationOTPEmail.PreviewProps = {
  otp: "483921",
  type: "email-verification",
} satisfies VerificationOTPEmailProps;

export { VerificationOTPEmail };
