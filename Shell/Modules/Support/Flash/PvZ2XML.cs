using Sen.Shell.Modules.Standards.IOModule.Buffer;
using Sen.Shell.Modules.Support.PvZ2.PAM;
using System.Xml;
using ImageInfo = Sen.Shell.Modules.Support.PvZ2.PAM.ImageInfo;
using System.Dynamic;
using System.Xml.Linq;
using System.Collections;

namespace Sen.Shell.Modules.Support.Flash
{
    using Object = Shell.Modules.Standards.Object;

    using FileSystem = Shell.Modules.Standards.IOModule.FileSystem;

    #region Abstract XML Class

    public abstract class XMLWrite
    {
        public abstract void WriteImageDocument(int index, string name, int[] size, double[] transform, string outpath);

        public abstract void WriteSourceDocument(int index, string name, int[] size, double[] transform, int resolution, string outpath);

        public abstract void InsertDOMDocumentData(DOMDocument data, string xml, string outFile);

        public abstract void WriteSpriteDocument(int sprite_index, int duration, int image_index, double[] transform, double[] color, string outFile);

        public abstract void AddImageToSpriteDocument(string inFile, double[] transform, double[] color, int image_index);
    }

    #endregion


    #region PvZ2 XML


    public struct DOMDocument
    {
        public required string[] media;

        public required string[] source;

        public required string[] image;

        public required string[] sprite;
    }


    public class PvZ2XML : XMLWrite
    {
        public PvZ2XML() { }

        public unsafe sealed override void InsertDOMDocumentData(DOMDocument dom, string xml, string outFile)
        {
            var domdocument_deserialize = XDocument.Parse(xml);
            var domdocument_namespace = domdocument_deserialize!.Root!.GetDefaultNamespace();
            var domdocument_resource_media_element = domdocument_deserialize!.Descendants(domdocument_namespace + "media").FirstOrDefault();
            if (domdocument_resource_media_element is not null)
            {
                foreach (var media in dom.media)
                {
                    domdocument_resource_media_element!.Add(new XElement(domdocument_namespace + "DOMBitmapItem", new XAttribute("name", $"media/{media}"), new XAttribute("href", $"media/{media}.png")));
                }
            }
            var document_resource_symbols_element = domdocument_deserialize.Descendants(domdocument_namespace + "symbols");
            if(document_resource_symbols_element is not null)
            {
                var document_resource_symbols_element_attribute_source = document_resource_symbols_element!.FirstOrDefault<XElement>()!.Elements(domdocument_namespace + "Include")
                    .Where(element => element!.Attribute("href")!.Value!.Contains("source"))!.ToList<XElement>();
                var document_resource_symbols_element_attribute_image = document_resource_symbols_element!.FirstOrDefault<XElement>()!.Elements(domdocument_namespace + "Include")
                    .Where(element => element!.Attribute("href")!.Value!.Contains("image")).ToList<XElement>();
                var document_resource_symbols_element_attribute_sprite = document_resource_symbols_element!.FirstOrDefault<XElement>()!.Elements(domdocument_namespace + "Include")
                    .Where(element => element.Attribute("href")!.Value.Contains("sprite")
                && !element.Attribute("href")!.Value.Contains("main_sprite")).ToList<XElement>();
                document_resource_symbols_element!.FirstOrDefault<XElement>()!.RemoveAll();
                dom.image.ToList<string>().ForEach(element =>
                (document_resource_symbols_element_attribute_image as List<XElement>)!.Add(new XElement(domdocument_namespace + "Include", new XAttribute("href", $"image/{element as string}.xml"))));
                dom.source.ToList<string>()!.ForEach(element =>
                (document_resource_symbols_element_attribute_source as List<XElement>)!.Add(new XElement(domdocument_namespace + "Include", new XAttribute("href", $"source/{element as string}.xml"))));
                dom.sprite.ToList<string>()!.ForEach(element =>
                (document_resource_symbols_element_attribute_sprite as List<XElement>)!.Add(new XElement(domdocument_namespace + "Include", new XAttribute("href", $"sprite/{element as string}.xml"))));
                document_resource_symbols_element!.FirstOrDefault<XElement>()!.RemoveAll();
                document_resource_symbols_element_attribute_source!.ToArray<XElement>()!.Concat<XElement>(document_resource_symbols_element_attribute_image!.ToArray<XElement>())
                    !.Concat<XElement>(document_resource_symbols_element_attribute_sprite!.ToArray<XElement>())!.ToList<XElement>()
                    !.Concat(new List<XElement>() { new XElement(domdocument_namespace + "Include", new XAttribute("href", $"main_sprite.xml")) })!.ToList<XElement>()
                    !.ForEach(element => document_resource_symbols_element!.FirstOrDefault<XElement>()!.Add(element as XElement));
            }
            var domdocument_serialize_settings = new XmlWriterSettings()
            {
                Indent = true,
                IndentChars = "\t",
                OmitXmlDeclaration = true,
            };
            using var domdocument_serialize_xml_writer = XmlWriter.Create(outFile, domdocument_serialize_settings);
            domdocument_deserialize.Save(domdocument_serialize_xml_writer);
            return;
        }

        public struct MatrixInformation
        {
            public required double[] transform { get; set; }
            public required double[] color { get; set; }

        }

        private unsafe static void AddDomFrame(XElement framesElement, int sprite_children_index, int duration, string libraryItemName, string symbolType, string loop, MatrixInformation Matrix, XNamespace g_namespace)
        {
            var newDomFrame = new XElement(g_namespace + "DOMFrame",
                new XAttribute("index", sprite_children_index),
                new XAttribute("duration", duration),
                new XElement(g_namespace + "elements",
                    new XElement(g_namespace + "DOMSymbolInstance",
                        new XAttribute("libraryItemName", libraryItemName),
                        new XAttribute("symbolType", symbolType),
                        new XAttribute("loop", loop),
                        new XElement(g_namespace + "matrix",
                            new XElement(g_namespace + "Matrix",
                                new XAttribute("a", PAM_Animation.ExchangeFloaterFixed(Matrix.transform[0])),
                                new XAttribute("b", PAM_Animation.ExchangeFloaterFixed(Matrix.transform[1])),
                                new XAttribute("c", PAM_Animation.ExchangeFloaterFixed(Matrix.transform[2])),
                                new XAttribute("d", PAM_Animation.ExchangeFloaterFixed(Matrix.transform[3])),
                                new XAttribute("tx", PAM_Animation.ExchangeFloaterFixed(Matrix.transform[4])),
                                new XAttribute("ty", PAM_Animation.ExchangeFloaterFixed(Matrix.transform[5]))
                            )
                        ),
                        new XElement(g_namespace + "color",
                            new XElement(g_namespace + "Color",
                                new XAttribute("redMultiplier", PAM_Animation.ExchangeFloaterFixed(Matrix.color[0])),
                                new XAttribute("greenMultiplier", PAM_Animation.ExchangeFloaterFixed(Matrix.color[1])),
                                new XAttribute("blueMultiplier", PAM_Animation.ExchangeFloaterFixed(Matrix.color[2])),
                                new XAttribute("alphaMultiplier", PAM_Animation.ExchangeFloaterFixed(Matrix.color[3]))
                            )
                        )
                    )
                )
            );
            framesElement.Add(newDomFrame);
            return;
        }

        public unsafe sealed override void WriteImageDocument(int index, string name, int[] size, double[] transform, string outpath)
        {
            var image = new ImageInfo()
            {
                name = name,
                size = size,
                transform = transform
            };
            var image_document = PAM_Animation.WriteImageDocument(index - 1, image);
            SenBuffer.SaveXml(outpath, image_document, PAM_Animation.xflns);
            return;
        }

        public unsafe sealed override void WriteSourceDocument(int index, string name, int[] size, double[] transform, int resolution, string outpath)
        {
            var image = new ImageInfo()
            {
                name = name,
                size = size,
                transform = transform
            };
            var source_document = PAM_Animation.WriteSourceDocument(index - 1, image, resolution);
            SenBuffer.SaveXml(outpath, source_document, PAM_Animation.xflns);
            return;
        }

        public unsafe sealed override void WriteSpriteDocument(int sprite_index, int duration, int image_index, double[] transform, double[] color, string outFile)
        {
            var document = $"<DOMSymbolItem xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" name=\"sprite/sprite_{sprite_index}\" symbolType=\"graphic\" xmlns=\"http://ns.adobe.com/xfl/2008/\">\r\n\t<timeline>\r\n\t\t<DOMTimeline name=\"sprite_{sprite_index}\">\r\n\t\t\t<layers>\r\n\t\t\t\t<DOMLayer name=\"1\">\r\n\t\t\t\t\t<frames>\r\n\t\t\t\t\t\t<DOMFrame index=\"0\" duration=\"{duration}\">\r\n\t\t\t\t\t\t\t<elements>\r\n\t\t\t\t\t\t\t\t<DOMSymbolInstance libraryItemName=\"image/image_{image_index}\" symbolType=\"graphic\" loop=\"loop\">\r\n\t\t\t\t\t\t\t\t\t<matrix>\r\n\t\t\t\t\t\t\t\t\t\t<Matrix a=\"{transform[0].ToString("N6").Replace(",", "")}\" b=\"{transform[1].ToString("N6").Replace(",", "")}\" c=\"{transform[2]}.000000\" d=\"{transform[3].ToString("N6").Replace(",", "")}\" tx=\"{transform[4].ToString("N6").Replace(",", "")}\" ty=\"{transform[5].ToString("N6").Replace(",", "")}\" />\r\n\t\t\t\t\t\t\t\t\t</matrix>\r\n\t\t\t\t\t\t\t\t\t<color>\r\n\t\t\t\t\t\t\t\t\t\t<Color redMultiplier=\"{color[0].ToString("N6").Replace(",", "")}\" greenMultiplier=\"{color[1].ToString("N6").Replace(",", "")}\" blueMultiplier=\"{color[2].ToString("N6").Replace(",", "")}\" alphaMultiplier=\"{color[3].ToString("N6").Replace(",", "")}\" />\r\n\t\t\t\t\t\t\t\t\t</color>\r\n\t\t\t\t\t\t\t\t</DOMSymbolInstance>\r\n\t\t\t\t\t\t\t</elements>\r\n\t\t\t\t\t\t</DOMFrame>\r\n\t\t\t\t\t</frames>\r\n\t\t\t\t</DOMLayer>\r\n\t\t\t</layers>\r\n\t\t</DOMTimeline>\r\n\t</timeline>\r\n</DOMSymbolItem>";
            var fs = new FileSystem();
            fs.OutFile<string>(outFile, document);
            return;
        }

        public unsafe sealed override void AddImageToSpriteDocument(string inFile, double[] transform, double[] color, int image_index)
        {
            var fs = new FileSystem();
            var doc = XDocument.Parse(fs.ReadText(inFile, Standards.IOModule.EncodingType.UTF8));
            var document_namespace = doc!.Root!.GetDefaultNamespace();
            var framesElement = doc.Descendants(document_namespace + "frames").First();
            AddDomFrame(framesElement, 1, 1, $"image/image_{image_index}", "graphic", "loop", new MatrixInformation() { 
                color = color, 
                transform = transform, 
            }, 
            g_namespace: document_namespace);
            SenBuffer.SaveXml(inFile, framesElement, PAM_Animation.xflns);
            return;
        }
    }
    #endregion


    public static class ExpandoObjectExtensions
    {
        public unsafe static XElement ToXElement(this ExpandoObject expando, string elementName)
        {
            #pragma warning disable CS8604
            var element = new XElement(elementName);
            foreach (var item in expando)
            {
                if (item.Value is ExpandoObject @object)
                {
                    element.Add(ToXElement(@object, item.Key));
                }
                else
                {
                    element.Add(new XAttribute(item.Key, item.Value));
                }
            }
            return element;
        }
    }


    public class XmlHelper
    {
        public unsafe static ExpandoObject Deserialize(string xmlString)
        {
            #pragma warning disable CS8602
            #pragma warning disable CS8619
            var document = XDocument.Parse(xmlString);
            var expando = new ExpandoObject();
            var dictionary = (IDictionary<string, object>)expando;
            dictionary[document.Root.Name.LocalName] = Deserialize(document.Root);
            return expando;
        }

        private unsafe static dynamic Deserialize(XElement element)
        {
            #pragma warning disable CS8619
            var expando = new ExpandoObject();
            var dictionary = (IDictionary<string, object>)expando;
            foreach (var attribute in element.Attributes())
            {
                if (attribute.Name.LocalName == "xsi" && attribute.Name.Namespace == XNamespace.Xmlns)
                {
                    dictionary["xsi"] = attribute.Value;
                }
                else
                {
                    dictionary[attribute.Name.LocalName] = attribute.Value;
                }
            }
            foreach (var childElement in element.Elements())
            {
                if (dictionary.TryGetValue(childElement.Name.LocalName, out object? value))
                {
                    if (value is List<dynamic> list)
                    {
                        list.Add(Deserialize(childElement));
                    }
                    else
                    {
                        dictionary[childElement.Name.LocalName] = new List<dynamic>
                { value,
                    Deserialize(childElement)
                };
                    }
                }
                else
                {
                    dictionary[childElement.Name.LocalName] = Deserialize(childElement);
                }
            }
            if (!dictionary.Any())
            {
                return element.Value;
            }
            return expando;
        }



        public unsafe static void Serialize(ExpandoObject expando, string outpath)
        {
            #pragma warning disable CS8619
            SenBuffer.SaveXml(outpath, expando.ToXElement("root"), "");
            return;
        }


        private unsafe static void CreateSerialize(XmlWriter xmlWriter, ExpandoObject expando)
        {
            var dictionary = (IDictionary<string, object>)expando;
            foreach (var keyValuePair in dictionary)
            {
                if (keyValuePair.Key == "xmlns")
                {
                    xmlWriter.WriteAttributeString("xmlns", keyValuePair.Value.ToString());
                }
                else if (keyValuePair.Value is ExpandoObject @object)
                {
                    xmlWriter.WriteStartElement(keyValuePair.Key);
                    CreateSerialize(xmlWriter, @object);
                    xmlWriter.WriteEndElement();
                }
                else if (keyValuePair.Value is IEnumerable and not string)
                {
                    foreach (var item in (IEnumerable)keyValuePair.Value)
                    {
                        xmlWriter.WriteStartElement(keyValuePair.Key);
                        CreateSerialize(xmlWriter, (ExpandoObject)item);
                        xmlWriter.WriteEndElement();
                    }
                }
                else
                {
                    xmlWriter.WriteAttributeString(keyValuePair.Key, keyValuePair.Value.ToString());
                }
            }
        }



    }
}
