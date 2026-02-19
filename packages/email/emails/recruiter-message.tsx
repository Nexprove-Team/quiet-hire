import {
  Container,
  Heading,
  Hr,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import EmailContainer from "../components/container";

interface RecruiterMessageEmailProps {
  candidateName: string;
  recruiterName: string;
  companyName: string;
  subject: string;
  body: string;
}

export default function RecruiterMessageEmail({
  candidateName,
  recruiterName,
  companyName,
  subject,
  body,
}: RecruiterMessageEmailProps) {
  return (
    <EmailContainer
      preview={
        <Preview>
          {recruiterName} from {companyName}: {subject}
        </Preview>
      }
    >
      <Container className="mx-auto my-0 max-w-150 rounded-lg border-solid border-gray-200 bg-white px-10 py-8">
        <Section className="mt-4 mb-8">
          <Text className="font-display m-0 text-7 font-bold tracking-tight text-brand-black">
            Hack<span className="text-brand-green">Hyre</span>
          </Text>
        </Section>

        <Heading className="font-display m-0 mb-4 text-7 font-bold text-brand-black">
          {subject}
        </Heading>

        <Text className="m-0 mb-6 text-4 leading-6 text-gray-600">
          Hi {candidateName},
        </Text>

        <Text className="m-0 mb-6 text-4 leading-6 text-gray-600 whitespace-pre-line">
          {body}
        </Text>

        <Text className="m-0 mb-2 text-4 leading-6 text-gray-600">
          Best regards,
        </Text>
        <Text className="m-0 mb-1 text-4 font-semibold leading-6 text-brand-black">
          {recruiterName}
        </Text>
        <Text className="m-0 text-3.5 leading-5 text-gray-500">
          {companyName}
        </Text>

        <Hr className="my-6 border-solid border-gray-200" />
        <Text className="m-0 text-3 leading-4 text-gray-400">
          &copy; {new Date().getFullYear()} HackHyre. All rights reserved.
        </Text>
        <Text className="m-0 mt-1 text-3 leading-4 text-gray-400">
          This message was sent via HackHyre on behalf of {recruiterName} at{" "}
          {companyName}.
        </Text>
      </Container>
    </EmailContainer>
  );
}

RecruiterMessageEmail.PreviewProps = {
  candidateName: "Alex Johnson",
  recruiterName: "Sarah Williams",
  companyName: "TechCorp",
  subject: "Following up on your application",
  body: "Thank you for applying to the Senior Frontend Engineer position. We were impressed by your experience and would love to discuss next steps.\n\nWould you be available for a quick call this week?",
} satisfies RecruiterMessageEmailProps;

export { RecruiterMessageEmail };
