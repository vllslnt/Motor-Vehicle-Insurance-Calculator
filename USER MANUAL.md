# User Guide

## Motor Vehicle Insurance Calculator

**Version:** 1.0

## Introduction

Motor Vehicle Insurance Calculator is a web-based application developed to estimate motor vehicle insurance premiums in accordance with the premium rate limits established by the Financial Services Authority (OJK) through Circular Letter No. 6/SEOJK.05/2017.

The application provides an estimated premium based on the information entered by the user. It is intended as an educational and informational tool and does not issue an insurance policy. The final premium remains subject to underwriting and approval by the selected insurance company.

## Application Workflow

The application guides users through five sequential steps. Each step must be completed before proceeding to the next.

### Step 1 – Vehicle Information (Data Kendaraan)

This step collects the information required to identify the insured vehicle and determine the applicable OJK premium category.

Users are required to provide the following information:

| Field | Description |
|--------|-------------|
| Vehicle Brand & Model | Enter the legal name of the vehicle. There is no maximum character limit. |
| Production Year | Select the manufacturing year of the vehicle. |
| Vehicle Value (TSI) | Enter the current insured value of the vehicle. Minimum value: **Rp 10.000.000**. |
| Vehicle Type | Select the appropriate vehicle category (Passenger Vehicle, Bus, Truck, or Heavy Equipment). |
| Vehicle Plate Region | Select the vehicle registration region (Region I, II, or III). |

After all required information has been entered successfully, click **Continue to Coverage** to proceed.

---

### Step 2 – Coverage Selection (Pertanggungan)

This step allows users to configure the desired insurance policy.

#### Coverage Type

Select one of the following insurance products:

**Comprehensive (All Risk)**

Provides protection against partial damage, major damage, and total loss of the insured vehicle.

**Total Loss Only (TLO)**

Provides compensation only when the vehicle is declared a total loss or when repair costs exceed the applicable threshold.

A brief explanation of each coverage type is displayed directly within the selection card to help users choose the most appropriate option.

#### Coverage Duration

Choose the desired policy period.

Available options:

- 1 Year
- 2 Years
- 3 Years
- 4 Years
- 5 Years

#### Additional Coverages

Users may optionally include additional protections such as:

- Third Party Liability (TPL)
- Personal Accident – Driver
- Personal Accident – Passenger

These optional protections increase the estimated insurance premium.

---

### Step 3 – Policy Holder Information (Data Pemegang Polis)

This step records the identity of the policy holder.

The following information is required:

| Field | Validation |
|--------|------------|
| Full Legal Name | Required |
| National Identification Number (NIK) | Exactly 16 numeric digits |
| Mobile Phone Number | Numeric input |
| Email Address | Valid email format |
| Residential Address | Minimum 10 characters |
| Coverage Effective Date | Selected from the date picker |

All information should match the policy holder's official identification documents.

---

### Step 4 – Premium Calculation (Kalkulasi Premi)

After all required information has been entered, the application automatically calculates the estimated insurance premium.

The calculation follows the premium rate limits established by **OJK Circular Letter No. 6/SEOJK.05/2017**.

The calculation process consists of the following stages:

1. The vehicle is classified into the appropriate OJK premium category based on its insured value (TSI).

2. The application determines the applicable premium rate according to:
   - Vehicle type
   - Coverage type
   - Registration region

3. The annual premium is calculated using the following formula:

```text
Annual Premium = TSI × OJK Premium Rate
```

4. If optional coverages are selected, their corresponding charges are added to the annual premium.

5. If the selected policy duration exceeds one year, the annual premium is multiplied by the selected number of coverage years.

The application displays:

- Vehicle information
- Selected insurance product
- Applicable OJK premium rate
- Estimated annual premium
- Additional coverage charges
- Estimated total premium

The displayed premium represents an estimation only. The final premium remains subject to underwriting by the insurance provider.

---

### Step 5 – Policy Summary (Penerbitan)

The final step presents a complete summary of the information entered throughout the application.

The summary includes:

- Vehicle information
- Policy holder information
- Selected insurance product
- Coverage duration
- Additional coverages
- Estimated insurance premium

Users may review all information before concluding the calculation.

If another calculation is required, selecting **New Calculation** resets the application and returns the user to Step 1.

## Input Validation

The application validates all user input before allowing progression to the next step.

Examples of implemented validation rules include:

| Input | Validation Rule |
|--------|-----------------|
| Vehicle Value | Minimum Rp 10.000.000 |
| Email Address | Valid email format |
| NIK | Exactly 16 digits |
| Mobile Phone Number | Numeric input |
| Residential Address | Minimum 10 characters |

If invalid information is entered, an error message is displayed beneath the corresponding input field to guide the user in correcting the input.

## Notes

- Premium values shown by the application are estimates only.
- The application follows the premium rate limits established by OJK.
- Actual premiums are determined through the underwriting process of the selected insurance company.
- The application does not issue insurance policies and should be used solely as an estimation tool.