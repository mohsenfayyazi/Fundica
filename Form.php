<?php
$url = gethostname();
class Form
{
    protected $sAction;
    
    protected $sMethod;
    
    protected $aElements = array();
    
    public function __construct($sAction, $sMethod = 'post')
    {
        $this->sAction = $sAction;
        $this->sMethod = $sMethod;
    }
    
    public function addElement(FormElement $ClassElement)
    {
        $this->aElements[] = $ClassElement;
    }
    
    public function render()
    {
        foreach ($this->aElements as $ClassElement)
        {
            $sElements .= $ClassElement->render() . "\\r\
";
        }
        return sprintf(
            '<form action="&#37;s" method="%s">
                %s
            </form>',
            $this->sAction,
            $this->sMethod,
            $sElements
        );
    }
}

abstract class FormElement
{
    protected $aAttributes;
    
    public function addAttribute($sName, $mValue)
    {
        $this->aAttributes[$sName] = $mValue;
    }
    
    abstract public function render();
}

class TextFormElement extends FormElement
{
    public function render()
    {
        foreach ($this->aAttributes as $sName => $mValue)
        {
            $sAttributes .= sprintf('%s="%s" ', $sName, $mValue);
        }
        return sprintf(
            '<input type="text" %s/>',
            $sAttributes
        );
    }
}



class SubmitFormElement extends FormElement
{
    public function render()
    {
        foreach ($this->aAttributes as $sName => $mValue)
        {
            $sAttributes .= sprintf('%s="%s" ', $sName, $mValue);
        }
        return sprintf(
            '<input type="submit" %s/>',
            $sAttributes
        );
    }
}

$ClassForm = new Form('/info');

switch ($url) {
    case "www.fundica.com":
        $ClassEmailField = new TextFormElement();
        $ClassEmailField->addAttribute('name', 'email');
        $ClassForm->addElement($ClassEmailField);
        $ClassPhoneField = new TextFormElement();
        $ClassPhoneField->addAttribute('name', 'phone');
        $ClassForm->addElement($ClassPhoneField);
        break;

    case "domain1.fundica.com":
        $ClassEmailField = new TextFormElement();
        $ClassEmailField->addAttribute('name', 'email');
        $ClassForm->addElement($ClassEmailField);
        $ClassPhoneField = new TextFormElement();
        $ClassPhoneField->addAttribute('name', 'phone');
        $ClassForm->addElement($ClassPhoneField);
        $ClassFirstnameField = new TextFormElement();
        $ClassFirstnameField->addAttribute('name', 'Firstname');
        $ClassForm->addElement($ClassFirstnameField);  
        break;

    case "domain2.fundica.com":
        $ClassEmailField = new TextFormElement();
        $ClassEmailField->addAttribute('name', 'email');
        $ClassForm->addElement($ClassEmailField);
        break;

    case "domain3.fundica.com":
        $ClassFirstnameField = new TextFormElement();
        $ClassFirstnameField->addAttribute('name', 'Firstname');
        $ClassForm->addElement($ClassFirstnameField);
        $ClassLastnameField = new TextFormElement();
        $ClassLastnameField->addAttribute('name', 'Lastname');
        $ClassForm->addElement($ClassLastnameField);
        $ClassPostalcodeField = new TextFormElement();
        $ClassPostalcodeField->addAttribute('name', 'Postalcode');
        $ClassForm->addElement($ClassPostalcodeField);
        break;
}


$ClassSubmitButton = new SubmitFormElement();
$ClassSubmitButton->addAttribute('name', 'submit');
$ClassForm->addElement($ClassSubmitButton);

echo $ClassForm->render();

?>
