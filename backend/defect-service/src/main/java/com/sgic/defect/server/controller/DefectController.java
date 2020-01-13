package com.sgic.defect.server.controller;

import java.io.IOException;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import com.sgic.common.api.enums.RestApiResponseStatus;
import com.sgic.common.api.response.ApiResponse;
import com.sgic.common.api.response.ContentResponse;
import com.sgic.common.api.response.ListContentResponse;
import com.sgic.common.email.EmailService;
import com.sgic.defect.dto.mapper.Mapper;
import com.sgic.defect.server.dto.DefectDto;
import com.sgic.defect.server.entities.Defect;
import com.sgic.defect.server.entities.Priority;
import com.sgic.defect.server.entities.Severity;
import com.sgic.defect.server.entities.Status;
import com.sgic.defect.server.entities.Type;
import com.sgic.defect.server.services.DefectService;
import com.sgic.defect.server.services.PriorityService;
import com.sgic.defect.server.services.SeverityService;
import com.sgic.defect.server.services.StatusService;
import com.sgic.defect.server.services.TypeService;

@CrossOrigin(origins = { "http://localhost:3000"})
@RestController
@RequestMapping("/api/v1")
public class DefectController {

	@Autowired
	DefectService defectService;

	@Autowired
	PriorityService priorityService;

	@Autowired
	SeverityService severityService;

	@Autowired
	StatusService statusService;

	@Autowired
	TypeService typeService;
	
	@Autowired
	private RestTemplate restTemplate;

	@Autowired
	private Mapper mapper;

	//Add Defect
	@PostMapping(value = "/defect")
	public ResponseEntity<Object> createDefect(@RequestBody DefectDto defectData) throws IOException{
		Defect defect = mapper.map(defectData, Defect.class);
		defectService.addDefect(defect);
		String from = "Notifications@defect-tracker.com";
		Priority pri = priorityService.getPriorityById(defectData.getPriorityId());
		String priority = pri.getName();
		String subject = "New "+priority+" Priority Defect";
		String to = getName("http://employee-service/api/v1/employee/email/"+defectData.getAssignedTo());
		String defectName = defectData.getName();
		String submoduleName= getName("http://project-service/api/v1/submodule/name/"+defectData.getSubmoduleId());
		String projectName = getName("http://project-service/api/v1/project/name/"+defectData.getProjectId());
		String content = "You have a "+priority+" Priority Defect \""+defectName+"\" on the "+submoduleName+" of the "+projectName;
		EmailService.sendMail(from,subject,to,content);
		return new ResponseEntity<>(new ApiResponse(RestApiResponseStatus.CREATED), HttpStatus.OK);
	}

	//Retrieve Name for the Given Id
	private String getName(String uri)
	{
	    String name = restTemplate.getForObject(uri, String.class);
	    return name;
	}

	//Get All Defect
	@GetMapping(value = "/defect")
	public ResponseEntity<Object> getAllDefect() {
		List<Defect> defect = defectService.getAllDefect();
		List<DefectDto> defectData = mapper.map(defect, DefectDto.class);

		for(DefectDto defectDto : defectData)
		{
			defectDto.setProjectName(getName("http://project-service/api/v1/project/name/"+defectDto.getProjectId()));

			defectDto.setModuleName(getName("http://project-service/api/v1/module/name/"+defectDto.getModuleId()));

			defectDto.setSubmoduleName(getName("http://project-service/api/v1/submodule/name/"+defectDto.getSubmoduleId()));

			defectDto.setAssignedToName(getName("http://employee-service/api/v1/employee/name/"+defectDto.getAssignedTo()));

			defectDto.setAssignedByName(getName("http://employee-service/api/v1/employee/name/"+defectDto.getAssignedBy()));

			defectDto.setCreatedByName(getName("http://employee-service/api/v1/employee/name/"+defectDto.getCreatedBy()));

			if(defectDto.getUpdatedBy()!=null) {
				defectDto.setUpdatedByName(getName("http://employee-service/api/v1/employee/name/"+defectDto.getUpdatedBy()));
			}

			Priority priority = priorityService.getPriorityById(defectDto.getPriorityId());
			defectDto.setPriorityName(priority.getName());

			Severity severity = severityService.getSeverityById(defectDto.getSeverityId());
			defectDto.setSeverityName(severity.getName());

			Status status = statusService.getStatusById(defectDto.getStatusId());
			defectDto.setStatusName(status.getName());

			Type type = typeService.getTypeById(defectDto.getTypeId());
			defectDto.setTypeName(type.getName());

		}

		return new ResponseEntity<>(new ListContentResponse<DefectDto>("listAllDefect",defectData, RestApiResponseStatus.RECEIVED), HttpStatus.OK);
	}

	//Update Defect
	@PutMapping(value = "/defect")
	public ResponseEntity<Object> updateDefect(@RequestBody DefectDto defectData) throws IOException {
		Defect defect = mapper.map(defectData, Defect.class);
		defectService.addDefect(defect);
		String from = "Notifications@defect-tracker.com";
		Status sta = statusService.getStatusById(defectData.getStatusId());
		String status = sta.getName();
		String subject = "Defect Status Changed: "+status;
		if(defectData.getUpdatedBy()==defectData.getAssignedTo()) {
			String to = getName("http://employee-service/api/v1/employee/email/"+defectData.getAssignedBy());
			String defectName = defectData.getName();
			String submoduleName= getName("http://project-service/api/v1/submodule/name/"+defectData.getSubmoduleId());
			String projectName = getName("http://project-service/api/v1/project/name/"+defectData.getProjectId());
			String content = "Defect \""+defectName+"\" on the "+submoduleName+" of the "+projectName+" is "+status;
			EmailService.sendMail(from,subject,to,content);
		}else {
			String to = getName("http://employee-service/api/v1/employee/email/"+defectData.getAssignedTo());
			String defectName = defectData.getName();
			String submoduleName= getName("http://project-service/api/v1/submodule/name/"+defectData.getSubmoduleId());
			String projectName = getName("http://project-service/api/v1/project/name/"+defectData.getProjectId());
			String content = "Defect \""+defectName+"\" on the "+submoduleName+" of the "+projectName+" is "+status;
			EmailService.sendMail(from,subject,to,content);
		}
		return new ResponseEntity<>(new ApiResponse(RestApiResponseStatus.UPDATED), HttpStatus.OK);
	}

	//Delete Defect
	@DeleteMapping(value = "/defect/{id}")
	public ResponseEntity<Object> removeDefect(@PathVariable Long id) {
		if(defectService.isIdExists(id)) {
			defectService.deleteDefect(id);
			return new ResponseEntity<>(new ApiResponse(RestApiResponseStatus.DELETED), HttpStatus.OK);
		}
		else {
			return new ResponseEntity<>(new ApiResponse(RestApiResponseStatus.NOT_FOUND), HttpStatus.NOT_FOUND);
		}
	}

	//Get Defect By Id
	@GetMapping(value = "/defect/{id}")
	public ResponseEntity<Object> getDefectById(@PathVariable Long id) {
		Defect defect = defectService.getDefectById(id);
		DefectDto defectDto = mapper.map(defect, DefectDto.class);

		defectDto.setProjectName(getName("http://project-service/api/v1/project/name/"+defectDto.getProjectId()));

		defectDto.setModuleName(getName("http://project-service/api/v1/module/name/"+defectDto.getModuleId()));

		defectDto.setSubmoduleName(getName("http://project-service/api/v1/submodule/name/"+defectDto.getSubmoduleId()));

		defectDto.setAssignedToName(getName("http://employee-service/api/v1/employee/name/"+defectDto.getAssignedTo()));

		defectDto.setAssignedByName(getName("http://employee-service/api/v1/employee/name/"+defectDto.getAssignedBy()));

		defectDto.setCreatedByName(getName("http://employee-service/api/v1/employee/name/"+defectDto.getCreatedBy()));

		if(defectDto.getUpdatedBy()!=null) {
			defectDto.setUpdatedByName(getName("http://employee-service/api/v1/employee/name/"+defectDto.getUpdatedBy()));
		}

		Priority priority = priorityService.getPriorityById(defectDto.getPriorityId());
		defectDto.setPriorityName(priority.getName());

		Severity severity = severityService.getSeverityById(defectDto.getSeverityId());
		defectDto.setSeverityName(severity.getName());

		Status status = statusService.getStatusById(defectDto.getStatusId());
		defectDto.setStatusName(status.getName());

		Type type = typeService.getTypeById(defectDto.getTypeId());
		defectDto.setTypeName(type.getName());

		return new ResponseEntity<>(new ContentResponse<DefectDto>("listDefect", defectDto, RestApiResponseStatus.RECEIVED), HttpStatus.OK);
	}

	//Check whether a Submodule, Employee exist on a Defect
	@GetMapping(value = "/defect/exist/{sid}")
	public boolean isIdExist(@PathVariable String sid)
	{
		if(sid.startsWith("SUB")) {
			String str=sid.substring(3);
			long id=Long.valueOf(str);
			return defectService.isSubmoduleIdExist(id);
		}
		else if(sid.startsWith("EMP")) {
			String str=sid.substring(3);
			long id=Long.valueOf(str);
			return defectService.isEmployeeIdExist(id);
		}
		else {
			return false;
		}

	}

}
