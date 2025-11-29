/**
 * Email template for manager when employee submits a new leave request
 */
export const leaveAppliedManagerTemplate = (leaveData) => {
  const { employeeName, employeeEmail, leaveType, startDate, endDate, totalDays, reason } = leaveData;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatLeaveType = (type) => {
    return type
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, (str) => str.toUpperCase())
      .trim();
  };

  const leaveTypeFormatted = formatLeaveType(leaveType);

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Leave Request</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f8fafc;">
  <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #f8fafc; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table role="presentation" style="max-width: 600px; width: 100%; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); overflow: hidden;">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); padding: 40px 30px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700;">Employee Leave Manager</h1>
              <p style="margin: 8px 0 0 0; color: #fef3c7; font-size: 14px;">New Leave Request Pending Review</p>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px 30px;">
              <h2 style="margin: 0 0 20px 0; color: #1e293b; font-size: 24px; font-weight: 600;">New Leave Request</h2>
              <p style="margin: 0 0 30px 0; color: #64748b; font-size: 16px; line-height: 1.6;">
                <strong>${employeeName}</strong> has submitted a new leave request that requires your approval.
              </p>

              <!-- Status Badge -->
              <div style="background-color: #fef3c7; color: #f59e0b; padding: 12px 20px; border-radius: 8px; margin-bottom: 30px; text-align: center;">
                <span style="font-weight: 600; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px;">Status: PENDING</span>
              </div>

              <!-- Employee Info -->
              <div style="background-color: #f8fafc; border-radius: 8px; padding: 20px; margin-bottom: 20px; border: 1px solid #e2e8f0;">
                <p style="margin: 0 0 8px 0; color: #64748b; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Employee</p>
                <p style="margin: 0 0 4px 0; color: #1e293b; font-size: 18px; font-weight: 700;">${employeeName}</p>
                <p style="margin: 0; color: #64748b; font-size: 14px;">${employeeEmail}</p>
              </div>

              <!-- Leave Details Card -->
              <div style="background-color: #f8fafc; border-radius: 8px; padding: 24px; margin-bottom: 30px; border: 1px solid #e2e8f0;">
                <h3 style="margin: 0 0 20px 0; color: #1e293b; font-size: 18px; font-weight: 600;">Leave Details</h3>
                
                <table role="presentation" style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 12px 0; color: #64748b; font-size: 14px; font-weight: 500; width: 140px;">Leave Type:</td>
                    <td style="padding: 12px 0; color: #1e293b; font-size: 14px; font-weight: 600;">${leaveTypeFormatted}</td>
                  </tr>
                  <tr>
                    <td style="padding: 12px 0; color: #64748b; font-size: 14px; font-weight: 500;">Start Date:</td>
                    <td style="padding: 12px 0; color: #1e293b; font-size: 14px; font-weight: 600;">${formatDate(startDate)}</td>
                  </tr>
                  <tr>
                    <td style="padding: 12px 0; color: #64748b; font-size: 14px; font-weight: 500;">End Date:</td>
                    <td style="padding: 12px 0; color: #1e293b; font-size: 14px; font-weight: 600;">${formatDate(endDate)}</td>
                  </tr>
                  <tr>
                    <td style="padding: 12px 0; color: #64748b; font-size: 14px; font-weight: 500;">Total Days:</td>
                    <td style="padding: 12px 0; color: #1e293b; font-size: 14px; font-weight: 600;">${totalDays} day${totalDays !== 1 ? 's' : ''}</td>
                  </tr>
                  <tr>
                    <td style="padding: 12px 0; color: #64748b; font-size: 14px; font-weight: 500; vertical-align: top;">Reason:</td>
                    <td style="padding: 12px 0; color: #1e293b; font-size: 14px; line-height: 1.6;">${reason}</td>
                  </tr>
                </table>
              </div>

              <!-- CTA Button -->
              <table role="presentation" style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
                <tr>
                  <td align="center">
                    <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/manager/pending" 
                       style="display: inline-block; background-color: #2563eb; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 6px rgba(37, 99, 235, 0.3);">
                      Review Request
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin: 0; color: #94a3b8; font-size: 14px; line-height: 1.6;">
                Please review and approve or reject this leave request at your earliest convenience.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f8fafc; padding: 30px; text-align: center; border-top: 1px solid #e2e8f0;">
              <p style="margin: 0 0 10px 0; color: #64748b; font-size: 14px;">
                This is an automated email from Employee Leave Management System.
              </p>
              <p style="margin: 0; color: #94a3b8; font-size: 12px;">
                Please do not reply to this email.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
};

