package email

import (
	"crypto/tls"
	"fmt"
	"log"
	"net/smtp"
	"strings"
)

type Service interface {
	SendOTP(toEmail, otpCode string) error
}

type ConsoleService struct{}

func (c *ConsoleService) SendOTP(toEmail, otpCode string) error {
	log.Printf("\n[EMAIL OTP] ========================================\n"+
		"To: %s\n"+
		"Code: %s (Valid for 10 minutes)\n"+
		"Subject: Your VaultKey Verification Code\n"+
		"====================================================\n", toEmail, otpCode)
	return nil
}

type SMTPService struct {
	Host     string
	Port     int
	Username string
	Password string
	From     string
}

func (s *SMTPService) SendOTP(toEmail, otpCode string) error {
	addr := fmt.Sprintf("%s:%d", s.Host, s.Port)
	subject := fmt.Sprintf("Your VaultKey Verification Code: %s", otpCode)
	body := fmt.Sprintf("Subject: %s\r\n"+
		"From: %s\r\n"+
		"To: %s\r\n"+
		"MIME-Version: 1.0\r\n"+
		"Content-Type: text/plain; charset=UTF-8\r\n\r\n"+
		"Your 6-digit VaultKey verification code is: %s\r\n\r\n"+
		"This code will expire in 10 minutes. If you did not request this, please ignore this email.\r\n",
		subject, s.From, toEmail, otpCode)

	auth := smtp.PlainAuth("", s.Username, s.Password, s.Host)
	if s.Port == 465 {
		tlsConfig := &tls.Config{ServerName: s.Host}
		conn, err := tls.Dial("tcp", addr, tlsConfig)
		if err != nil {
			return fmt.Errorf("tls dial failed: %w", err)
		}
		defer conn.Close()

		c, err := smtp.NewClient(conn, s.Host)
		if err != nil {
			return err
		}
		defer c.Quit()

		if err = c.Auth(auth); err != nil {
			return fmt.Errorf("smtp auth failed: %w", err)
		}
		if err = c.Mail(s.From); err != nil {
			return err
		}
		if err = c.Rcpt(toEmail); err != nil {
			return err
		}
		w, err := c.Data()
		if err != nil {
			return err
		}
		if _, err = w.Write([]byte(body)); err != nil {
			return err
		}
		return w.Close()
	}

	return smtp.SendMail(addr, auth, s.From, []string{strings.TrimSpace(toEmail)}, []byte(body))
}
