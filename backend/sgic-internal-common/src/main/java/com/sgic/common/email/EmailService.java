package com.sgic.common.email;

import java.io.IOException;

import com.sendgrid.Method;
import com.sendgrid.Request;
import com.sendgrid.Response;
import com.sendgrid.SendGrid;
import com.sendgrid.helpers.mail.Mail;
import com.sendgrid.helpers.mail.objects.Content;
import com.sendgrid.helpers.mail.objects.Email;


public class EmailService {
	
	public static void sendMail(String froms, String sub, String tos, String cont) throws IOException{
		Email from = new Email(froms);
	    String subject = sub;
	    Email to = new Email(tos);
	    Content content = new Content("text/plain", cont);
	    Mail mail = new Mail(from, subject, to, content);
	
	    SendGrid sg = new SendGrid("API_KEY");
	    Request request = new Request();
	    try {
	      request.setMethod(Method.POST);
	      request.setEndpoint("mail/send");
	      request.setBody(mail.build());
	      Response response = sg.api(request);
	      System.out.println(response.getStatusCode());
	      System.out.println(response.getBody());
	      System.out.println(response.getHeaders());
	    } catch (IOException ex) {
	      throw ex;
	    }
	}
}
