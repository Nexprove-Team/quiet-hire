import {
  Font,
  Head,
  Html,
  Tailwind,
  pixelBasedPreset,
  Body,
} from "@react-email/components";

const EmailContainer = ({
  children,
  preview,
  additionalHeadContent,
}: {
  children: React.ReactNode;
  preview?: React.ReactNode;
  additionalHeadContent?: React.ReactNode;
}) => {
  return (
    <Html>
      <Tailwind
        config={{
          presets: [pixelBasedPreset],
          theme: {
            extend: {
              colors: {
                brand: {
                  DEFAULT: "#24E673",
                  green: "#24E673",
                  charcoal: "#232426",
                  navy: "#202331",
                  black: "#131315",
                  white: "#FBFBFB",
                },
              },
              fontFamily: {
                sans: ["Nunito", "Helvetica", "sans-serif"],
                display: ["Bricolage Grotesque", "Helvetica", "sans-serif"],
              },
            },
          },
        }}
      >
        <Head>
          <meta name="color-scheme" content="light dark" />
          <meta name="supported-color-schemes" content="light dark" />

          {/* Nunito — Brand body font */}
          <Font
            fontFamily="Nunito"
            fallbackFontFamily="Helvetica"
            webFont={{
              url: "https://fonts.gstatic.com/s/nunito/v26/XRXI3I6Li01BKofiOc5wtlZ2di8HDIkhdTQ3j6zbXWjgeg.woff2",
              format: "woff2",
            }}
            fontWeight={400}
            fontStyle="normal"
          />
          <Font
            fontFamily="Nunito"
            fallbackFontFamily="Helvetica"
            webFont={{
              url: "https://fonts.gstatic.com/s/nunito/v26/XRXI3I6Li01BKofiOc5wtlZ2di8HDIkhdTA3j6zbXWjgeg.woff2",
              format: "woff2",
            }}
            fontWeight={600}
            fontStyle="normal"
          />
          <Font
            fontFamily="Nunito"
            fallbackFontFamily="Helvetica"
            webFont={{
              url: "https://fonts.gstatic.com/s/nunito/v26/XRXI3I6Li01BKofiOc5wtlZ2di8HDIkhdQg0j6zbXWjgeg.woff2",
              format: "woff2",
            }}
            fontWeight={700}
            fontStyle="normal"
          />

          {/* Bricolage Grotesque — Brand display font */}
          <Font
            fontFamily="Bricolage Grotesque"
            fallbackFontFamily="Helvetica"
            webFont={{
              url: "https://fonts.gstatic.com/s/bricolagegrotesque/v7/3y9U6as8bTXq_nANBjzKo3IeZx8z6up5BeSl5jBNz_19PcbfJGoDR0oj.woff2",
              format: "woff2",
            }}
            fontWeight={400}
            fontStyle="normal"
          />
          <Font
            fontFamily="Bricolage Grotesque"
            fallbackFontFamily="Helvetica"
            webFont={{
              url: "https://fonts.gstatic.com/s/bricolagegrotesque/v7/3y9U6as8bTXq_nANBjzKo3IeZx8z6up5BeSl5jBNz_19PcbfJKQDR0oj.woff2",
              format: "woff2",
            }}
            fontWeight={600}
            fontStyle="normal"
          />
          <Font
            fontFamily="Bricolage Grotesque"
            fallbackFontFamily="Helvetica"
            webFont={{
              url: "https://fonts.gstatic.com/s/bricolagegrotesque/v7/3y9U6as8bTXq_nANBjzKo3IeZx8z6up5BeSl5jBNz_19PcbfJJ0DR0oj.woff2",
              format: "woff2",
            }}
            fontWeight={700}
            fontStyle="normal"
          />

          {additionalHeadContent}
        </Head>

        {preview}

        <Body className="font-sans mx-auto my-auto max-w-150 bg-brand-white px-2 font-normal text-brand-black">
          {children}
        </Body>
      </Tailwind>
    </Html>
  );
};

export default EmailContainer;
