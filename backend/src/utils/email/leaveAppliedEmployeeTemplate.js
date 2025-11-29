/**
 * Email template for employee when they apply for leave
 */
export const leaveAppliedEmployeeTemplate = (leaveData) => {
  const { employeeName, leaveType, startDate, endDate, totalDays, reason, status } = leaveData;

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
  const statusColor = status === 'pending' ? '#f59e0b' : status === 'approved' ? '#10b981' : '#ef4444';
  const statusBg = status === 'pending' ? '#fef3c7' : status === 'approved' ? '#d1fae5' : '#fee2e2';

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Leave Request Submitted</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f8fafc;">
  <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #f8fafc; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table role="presentation" style="max-width: 600px; width: 100%; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); overflow: hidden;">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #2563eb 0%, #4f46e5 100%); padding: 40px 30px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700;">Employee Leave Manager</h1>
              <p style="margin: 8px 0 0 0; color: #e0e7ff; font-size: 14px;">Leave Request Confirmation</p>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px 30px;">
              <h2 style="margin: 0 0 20px 0; color: #1e293b; font-size: 24px; font-weight: 600;">Hello ${employeeName},</h2>
              <p style="margin: 0 0 30px 0; color: #64748b; font-size: 16px; line-height: 1.6;">
                Your leave request has been successfully submitted and is now pending manager approval.
              </p>

              <!-- Status Badge -->
              <div style="background-color: ${statusBg}; color: ${statusColor}; padding: 12px 20px; border-radius: 8px; margin-bottom: 30px; text-align: center;">
                <span style="font-weight: 600; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px;">Status: ${status.toUpperCase()}</span>
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
                    <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/employee/requests" 
                       style="display: inline-block; background-color: #2563eb; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 6px rgba(37, 99, 235, 0.3);">
                      View Dashboard
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin: 0; color: #94a3b8; font-size: 14px; line-height: 1.6;">
                You will receive an email notification once your manager reviews your request.
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

