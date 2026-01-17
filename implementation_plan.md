# Calculator Localization Implementation Plan

This plan details the steps to localize the Industrial Accident Compensation Calculator (`/calculator`).

## Proposed Changes

### Localization Infrastructure

#### [MODIFY] [config.ts](file:///c:/Users/highs/OneDrive/Desktop/crusor/hospital_data/lib/i18n/config.ts)

- **Update `CalculatorTranslation` interface** with comprehensive keys:
  ```typescript
  interface CalculatorTranslation {
    title: string;
    description: string;
    sections: {
      wageInput: {
        title: string;
        desc: string;
        labels: { m1: string; m2: string; m3: string };
      };
      ageCheck: { title: string; desc: string; realAge: string; note: string };
      result: {
        title: string;
        averageWage: { title: string; btn: string };
        sickLeave: { title: string; btn: string };
        disability: { title: string; desc: string; btn: string };
      };
      footer: { title: string; desc: string };
    };
    buttons: {
      calculate: string;
      viewReport: string;
      save: string;
      saving: string;
      backToDashboard: string;
    };
    units: { won: string; year: string; days: string };
    alerts: {
      calculateFirst: string;
      inputRequired: string;
      saveSuccess: string;
      saveFail: string;
    };
    dialogs: {
      averageWage: {
        title: string;
        calculated: string;
        basis: string;
        basisDesc: string;
        note: string;
      };
      sickLeave: {
        title: string;
        expected: string;
        perDay: string;
        adjustDays: string;
        specialCase: string;
        specialCaseDesc: string;
        calculation: string;
      };
      disability: {
        title: string;
        grade: string;
        pensionOnly: string;
        lumpOnly: string;
        choice: string;
        pension: string;
        lump: string;
        expectedPension: string;
        expectedLump: string;
      };
    };
  }
  ```
- **Update `calculatorTranslations` object**: Populate with translations for all 10 locales: `ko`, `en`, `zh`, `vi`, `th`, `uz`, `mn`, `id`, `ne`, `hi`.
  - _Note_: Automated translation will be used for non-Korean/English languages initially.

### Calculator Components

#### [MODIFY] [CalculatorClient.tsx](file:///c:/Users/highs/OneDrive/Desktop/crusor/hospital_data/app/calculator/CalculatorClient.tsx)

- **Props**: No change needed (uses client hooks).
- **Logic**:
  - Determine `currentLocale` from localStorage or other mechanism (already partly implemented).
  - Select translation object based on locale.
  - Replace hardcoded Korean strings (Title, Descriptions, Inputs, Buttons) with `t.key`.

#### [MODIFY] [DisabilityCalculator.tsx](file:///c:/Users/highs/OneDrive/Desktop/crusor/hospital_data/components/calculator/DisabilityCalculator.tsx)

- **Props**: Add `locale: Locale`.
- **Logic**:
  - Use `calculatorTranslations[locale]` to get text.
  - Translate: "Grade 1-14", "Pension only", "Lump sum only", "Choice available", Disclaimer textual content.

## Verification Plan

### Manual Verification

1.  **Language Switching**: Use the header language switcher to toggle between KO, EN, ZH.
2.  **UI Check**: Verify `CalculatorClient` title, labels, and placeholders change.
3.  **Result Check**: Perform a calculation and check the `DisabilityCalculator` result card text (payment types, grades).
