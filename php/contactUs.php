<?php
// Enable error reporting for debugging (remove in production)
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Function to sanitize input
function sanitize_input($data) {
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data, ENT_QUOTES, 'UTF-8');
    return $data;
}

// Function to log form submissions
function log_submission($data) {
    $log_file = 'form_submissions.log';
    $timestamp = date('Y-m-d H:i:s');
    $log_entry = $timestamp . " - " . json_encode($data) . "\n";
    file_put_contents($log_file, $log_entry, FILE_APPEND);
}

// Process form submission
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Sanitize and validate input
    $name = sanitize_input(filter_input(INPUT_POST, 'name', FILTER_SANITIZE_STRING));
    $email = sanitize_input(filter_input(INPUT_POST, 'email', FILTER_SANITIZE_EMAIL));
    $subject = sanitize_input(filter_input(INPUT_POST, 'subject', FILTER_SANITIZE_STRING));
    $message = sanitize_input(filter_input(INPUT_POST, 'message', FILTER_SANITIZE_STRING));

    // Validate required fields
    if (empty($name) || empty($email) || empty($subject) || empty($message)) {
        echo json_encode(['status' => 'error', 'message' => 'All fields are required.']);
        exit;
    }

    // Validate email
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo json_encode(['status' => 'error', 'message' => 'Invalid email address.']);
        exit;
    }

    // Prepare email
    $to = 'bookings@batsumilodge.com';
    $email_subject = "New Contact Form Submission: $subject";
    $email_body = "You have received a new message from the Batsumi Lodge website.\n\n"
                . "Name: $name\n"
                . "Email: $email\n"
                . "Subject: $subject\n"
                . "Message:\n$message\n";

    // Additional headers
    $headers = "From: $name <$email>" . "\r\n";
    $headers .= "Reply-To: $email" . "\r\n";
    $headers .= "X-Mailer: PHP/" . phpversion() . "\r\n";
    $headers .= "MIME-Version: 1.0" . "\r\n";
    $headers .= "Content-Type: text/plain; charset=UTF-8" . "\r\n";

    // Configure email settings
    ini_set("sendmail_from", $to);
    ini_set("SMTP", "smtp.example.com");  // Replace with your SMTP server
    ini_set("smtp_port", "587");  // Replace with your SMTP port

    // Attempt to send email
    if (mail($to, $email_subject, $email_body, $headers)) {
        // Log successful submission
        log_submission([
            'name' => $name,
            'email' => $email,
            'subject' => $subject,
            'message' => $message,
            'status' => 'success'
        ]);
        echo json_encode(['status' => 'success', 'message' => 'Your message has been sent successfully.']);
    } else {
        // Log failed submission
        log_submission([
            'name' => $name,
            'email' => $email,
            'subject' => $subject,
            'message' => $message,
            'status' => 'failed'
        ]);
        echo json_encode(['status' => 'error', 'message' => 'Failed to send message. Please try again later.']);
    }
    exit;
}

// If not a POST request, return an error
echo json_encode(['status' => 'error', 'message' => 'Invalid request method.']);
exit;
?>